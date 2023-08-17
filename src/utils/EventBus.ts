export class EventBus {
	private readonly listeners: {}

	constructor() {
		this.listeners = {}
	}

	on(event: string, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}

		this.listeners[event].push(callback)
	}

	off(event: string, callback) {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`)
		}

		this.listeners[event] = this.listeners[event].filter((listener) => {
			return listener !== callback
		})
	}

	emit(event: string, ...args) {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`)
		}

		this.listeners[event].forEach((listener) => {
			listener(...args)
		})
	}
}
