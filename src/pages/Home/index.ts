import Block from '../../utils/Block.ts'
import template from './home.hbs'
import { Button } from '../../components/UI/Button'

export class HomePage extends Block {
	constructor() {
		super('div')
	}

	protected render(): string {
		const button = new Button({
			label: 'Click me',
			events: {
				click: () => console.log('click'),
			},
		})
		return template({ button: button.getContent()?.outerHTML })
	}
}
