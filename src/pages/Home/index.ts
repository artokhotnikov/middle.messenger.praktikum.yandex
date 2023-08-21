import Block from '../../utils/Block.ts'
import template from './home.hbs'
import { Button } from '../../components/UI/Button'

type HomePageProps = {
	button: Button
}

export class HomePage extends Block {
	constructor(props: HomePageProps) {
		super('div', props)
	}

	protected render(): string {
		return this.compile(template, { button: this.props.button })
	}
}
