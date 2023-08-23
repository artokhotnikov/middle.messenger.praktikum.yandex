import { HomePage } from './pages/Home'

window.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#app')

	const homePage = new HomePage({ title: '1333' })

	root.append(homePage.getContent()!)
})
