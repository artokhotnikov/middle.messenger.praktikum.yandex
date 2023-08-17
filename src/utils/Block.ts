/* eslint-disable no-undef */
import { EventBus } from './eventBus.ts'
import { v4 as makeUUID } from 'uuid'
import Handlebars from 'handlebars';

class Block {
	static EVENTS: Record<string, string> = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
	}

	protected props: Record<string, unknown>
	private _element: HTMLElement | null = null
	private readonly _meta: { tagName: string; props: any }
	_id: string
	private children
	private eventBus: EventBus

	constructor(tagName = 'div', propsAndChildren: any = {}) {
		const { children, props } = this._getChildren(propsAndChildren)

		this.children = children
		this._meta = {
			tagName,
			props,
		}
		this._id = makeUUID()
		this.eventBus = new EventBus()
		this.props = this._makePropsProxy({ ...props, __id: this._id })
		this._registerEvents()
		this.eventBus.emit(Block.EVENTS.INIT)
	}

	private _getChildren(propsAndChildren): Object {
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

	compile(template, props) {
		const propsAndStubs = { ...props }

		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id='${child._id}'></div>`
		})

		const fragment = this._createDocumentElement('template')

		fragment.innerHTML = Handlebars.compile(template, propsAndStubs)

		Object.values(this.children).forEach((child) => {
			const stub = fragment.content.querySelector(`[data-id="${child.id}"]`)

			stub.replaceWith(child.getContent())
		})

		return fragment.content
	}

	private _registerEvents(): void {
		this.eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
		this.eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
		this.eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidMount.bind(this))
		this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
	}

	private _createResources(): void {
		const { tagName } = this._meta
		this._element = this._createDocumentElement(tagName)
	}

	// создаем элемент обертку и вызывает первый рендер
	init(): void {
		// создание обертки
		this._createResources()

		// тригер ренденр
		this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
	}

	private _componentDidMount(): void {
		this.componentDidMount()
		Object.values(this.children).forEach((child) => {
			child.dispatchComponentDidMount()
		})
	}

	componentDidMount(oldProps?) {}

	public dispatchComponentDidMount() {
		this.eventBus.emit(Block.EVENTS.FLOW_CDM)
	}

	//
	private _componentDidUpdate(oldProps: any, newProps: any) {
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

		this._removeEvents()
		this._element!.innerHTML = '' // удаляем предыдущее содержимое

		this._element!.innerHTML = block

		this._addEvents()
	}

	// Переопределяется пользователем. Необходимо вернуть разметку
	protected render(): string {
		return ''
	}

	getContent() {
		return this.element
	}

	// создаем прокси для пропсов
	// ставим ловушки на изменение пропсов
	// обновляем его и вызываем событие component-did-update
	_makePropsProxy(props: any) {
		// Ещё один способ передачи this, но он больше не применяется с приходом ES6+
		const self = this

		// Здесь вам предстоит реализовать метод

		return new Proxy(props, {
			get(target, props) {
				return typeof target[props] === 'function' ? target[props].bind(target) : target[props]
			},

			set(target, props, value) {
				const oldTarget = { ...target }
				target[props] = value

				// передаем старый обьет и новый
				// при обновлений пропсов срабатывает этот прокси и вызывает событие cdu
				// на него подписано _componentDidUpdate
				self.eventBus.emit(Block.EVENTS.CDU, oldTarget, target)
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