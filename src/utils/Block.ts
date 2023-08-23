/* eslint-disable no-undef */
import { EventBus } from './eventBus.ts'
import { v4 as makeUUID } from 'uuid'

class Block<T> {
	static EVENTS: Record<string, string> = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
	}

	_id: string
	protected props: T
	protected children
	private _element: HTMLElement | null = null
	private eventBus: EventBus
	private readonly _meta: { props: T }

	constructor(propsAndChildren: T) {
		const { children, props } = this._getChildrenAndProps(propsAndChildren)
		this.children = children
		this._meta = {
			props,
		}
		this._id = makeUUID()
		this.eventBus = new EventBus()
		this.props = this._makePropsProxy({ ...props, __id: this._id })
		this._registerEvents()
		this.eventBus.emit(Block.EVENTS.INIT)
	}

	private _registerEvents(): void {
		this.eventBus.on(Block.EVENTS.INIT, this._init.bind(this))
		this.eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
		this.eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
		this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
	}

	private _getChildrenAndProps(propsAndChildren: T): Object {
		const children = {}
		const props = {}
		Object.entries(propsAndChildren).forEach(([key, value]) => {
			if (value instanceof Block) {
				children[key] = value
			} else {
				props[key] = value
			}
		})

		return { children, props }
	}

	// создаем подписки на события
	private _addEvents() {
		const { events = {} } = this.props
		Object.keys(events).forEach((eventName) => {
			this._element!.addEventListener(eventName, events[eventName])
		})
	}

	protected compile(template, props) {
		const propsAndStubs = { ...props }
		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id='${child._id}'></div>`
		})

		const html = template(propsAndStubs)
		const fragment = this._createDocumentElement('template')

		fragment.innerHTML = html
		Object.values(this.children).forEach((child) => {
			const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
			stub.replaceWith(child.getContent()!)
		})
		return fragment.content
	}

	private _init(): void {
		// тригер ренденр
		this.init()
		this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
	}

	protected init(): void {}

	private _componentDidMount(): void {
		this.componentDidMount()
		Object.values(this.children).forEach((child) => {
			child.dispatchComponentDidMount()
		})
	}

	componentDidMount(oldProps?: T) {}

	public dispatchComponentDidMount() {
		this.eventBus.emit(Block.EVENTS.FLOW_CDM)
	}

	//
	private _componentDidUpdate(oldProps: T, newProps: T) {
		// если это событие возвращает true
		// то вызываем событие рендера
		if (this.componentDidUpdate(oldProps, newProps)) {
			this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
		}
	}

	protected componentDidUpdate(oldProps, newProps): boolean {
		return true
	}

	// после вмонтирования компонента в страницу, нам может потребоваться
	// обновить его параметра/пропсы
	// мы можем их передать извне
	// принимаем новые пропсы и добавляем/копируем их в имеющиеся
	// после обновления пропсов должен сработать метод component-did-update
	// этот жизненый цикл срабатывает на обновление компонента
	// здесь мы обновили пропсы
	// сработа ловушка из _makePropsProxy
	// отработало событие cdu
	setProps(nextProps) {
		if (!nextProps) {
			return
		}
		Object.assign(this.props, nextProps)
	}

	get element() {
		return this._element
	}

	// удаляем подписки на события
	private _removeEvents() {
		const { events = {} } = this.props
		Object.keys(events).forEach((eventName) => {
			this._element!.removeEventListener(eventName, events[eventName])
		})
	}

	// создание блока, рендер
	// отписка от старых событий и подписка на новые
	// после этого нужно вызвать событие component-did-mount
	// с помощью dispatchComponentDidMount, делается это вне класса, а там где файл компонента
	// первый цикл жизни компонента завершился
	// первый цикл - инит - рендер - компонент дид маунт
	private _render() {
		const block = this.render() // render теперь возвращает DocumentFragment

		const newElement = block.firstElementChild as HTMLElement
		if (this._element) {
			this._element.replaceWith(newElement)
		}

		this._element = newElement
		this._removeEvents()
		this._addEvents()
	}

	// Переопределяется пользователем. Необходимо вернуть разметку
	protected render(): DocumentFragment {
		return new DocumentFragment()
	}

	getContent() {
		return this.element
	}

	// создаем прокси для пропсов
	// ставим ловушки на изменение пропсов
	// обновляем его и вызываем событие component-did-update
	_makePropsProxy(props: T) {
		// Ещё один способ передачи this, но он больше не применяется с приходом ES6+
		const self = this

		return new Proxy(props, {
			get(target, props) {
				return typeof target[props] === 'function' ? target[props].bind(target) : target[props]
			},

			set(target, prop, value) {
				const oldTarget = { ...target }
				target[prop] = value
				// передаем старый обьет и новый
				// при обновлений пропсов срабатывает этот прокси и вызывает событие cdu
				// на него подписано _componentDidUpdate
				self.eventBus.emit(Block.EVENTS.FLOW_CDU, oldTarget, target)
				return true
			},

			deleteProperty(): boolean {
				throw new Error('Нет доступа')
			},
		})
	}

	_createDocumentElement(tagName) {
		// Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
		const element = document.createElement(tagName)
		if (this.props.meta?.withInternalId) {
			element.setAttribute('data-id', this._id)
		}
		return element
	}

	show() {
		this.getContent()!.style.display = 'block'
	}

	hide() {
		this.getContent()!.style.display = 'none'
	}
}

export default Block
