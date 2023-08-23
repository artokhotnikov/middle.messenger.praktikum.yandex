import Handlebars from 'handlebars'
import Block from './Block.ts'
import { HelperOptions } from 'handlebars'

export function registerComponent(name: string, Component: typeof Block) {
	if (name in Handlebars.helpers) {
		throw `The ${name} component is already registered!`
	}

	Handlebars.registerHelper(name, function (this: unknown, { hash, data, fn }: HelperOptions) {
		console.log(data)
		const component = new Component(hash)
		const dataAttribute = `data-id="${component._id}"`

		if ('ref' in hash) {
			(data.root.__refs = data.root.__refs || {})[hash.ref] = component
		}

		(data.root.__children = data.root.__children || []).push(component)

		const contents = fn ? fn(this) : ''

		return `<div ${dataAttribute}>${contents}</div>`
	})
}
