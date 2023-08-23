import Block from '../../utils/Block.ts'
import template from './home.hbs'
import { Button } from '../../components/UI/Button'

type HomePageProps = {
	title: string
}

export class HomePage extends Block<HomePageProps> {
	constructor(props: HomePageProps) {
		super(props)
	}

	protected init() {
		this.children.button = new Button({
			label: 'Clic123k',
			type: 'submit',
			className: 'primary',
			events: {
				click:  () => {
					this.children.button.setProps({
						label: Math.random(),
					})
				},
			},
		})
	}

	protected render(): DocumentFragment {
		return this.compile(template, this.props)
	}
}
