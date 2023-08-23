import Block from '../../../utils/Block.ts'
import template from './button.hbs'

type ButtonProps = {
	label: string
	type?: 'submit' | 'button'
	className: string,
	events: {
		click: () => void
	}
	meta?: {
		withInternalId?: boolean
	}
}

export class Button extends Block<ButtonProps> {
	constructor(props: ButtonProps) {
		super(props)
	}

	protected render(): DocumentFragment {
		return this.compile(template, this.props)
	}
}
