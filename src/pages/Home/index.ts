import Block from '../../utils/Block.ts'
import template from './home.hbs'
import { Button } from '../../components/UI/Button'

type HomePageProps = {
	button: Button
	title: string
}

export class HomePage extends Block<HomePageProps> {
	constructor(props: HomePageProps) {
		super(props)
	}

	protected render(): DocumentFragment {
		return this.compile(template, this.props)
	}
}
