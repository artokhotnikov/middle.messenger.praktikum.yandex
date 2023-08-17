import Handlebars from 'handlebars';
import { PluginOption } from 'vite';

export default function handlebars(): PluginOption {
	const fileRegExp = /\.hbs$|\.handlebars$/;
	return {
		name: 'vite-plugin-handlebars-precompile',
		transform(src, id) {
			if (!fileRegExp.test(id)) {
				return;
			}
			// language=typescript
			const code = `
        import Handlebars from 'handlebars/runtime';
        export default Handlebars.template(${Handlebars.precompile(src)});
      `;
			return {
				code,
			};
		},
	};
}
