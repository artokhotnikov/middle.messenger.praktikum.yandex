import { HomePage } from './pages/Home'
import { Button } from './components/UI/Button'

window.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#app')

	const button = new Button({
		label: 'Clic123k',
		type: 'submit',
		events: {
			click: function () {
				button.setProps({
					label: Math.random(),
				})
			},
		},
	})


	const homePage = new HomePage({ button, title: '1333' })

	root.append(homePage.getContent()!)
})
