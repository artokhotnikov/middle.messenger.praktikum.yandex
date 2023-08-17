import { HomePage } from './pages/Home'

window.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#app')

	const homePage = new HomePage()

	root.append(homePage.getContent()!)
})
