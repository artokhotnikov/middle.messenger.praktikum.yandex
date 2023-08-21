import Block from '../../../utils/Block.ts'
import template from './button.hbs'

type ButtonProps = {
	label: string
	events: {
		click: () => void
	}
	meta?: {
		withInternalId?: boolean
	}
}

export class Button extends Block {
	constructor(props: ButtonProps) {
		super('button', props)
	}

	protected render(): string {
		return this.compile(template, { label: this.props.label })
	}
}
