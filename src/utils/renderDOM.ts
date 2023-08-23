export function render(rootElement: string, block) {
	const root: HTMLElement | null = document.querySelector(rootElement)

	// Можно завязаться на реализации вашего класса Block
	root!.appendChild(block.getContent())

	block.dispatchComponentDidMount()

	return root
}
