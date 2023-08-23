import { HomePage } from './pages/Home'
import { Button } from './components/UI/Button'
import { registerComponent } from './utils/registerComponents.ts'

registerComponent('Button', Button)

window.addEventListener('DOMContentLoaded', () => {
	const root = document.querySelector('#app')

	const homePage = new HomePage({ title: '1333' })

	root.append(homePage.getContent()!)

	homePage.dispatchComponentDidMount()
})

//23 минуты
