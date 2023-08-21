import { HomePage } from './pages/Home'
import { Button } from './components/UI/Button'

window.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#app')

	const button = new Button({
		label: 'Click',
		events: {
			click: () => console.log('click'),
		},
	})

	const homePage = new HomePage({ button })

	root.append(homePage.getContent()!)
})
