type METHODS = {
	GET: 'GET'
	PUT: 'PUT'
	POST: 'POST'
	DELETE: 'DELETE'
}

type Options = {
	method?: METHODS
	timeout?: number
	headers?: Record<string, string>
	data?: Record<string, unknown>
}

type HTTPRequest = (url: string, options?: Options) => Promise<unknown>

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data) {
	// Можно делать трансформацию GET-параметров в отдельной функции
	let string = '?'
	Object.keys(data).forEach((key) => {
		string += `${key}=${data[key].toString()}&`
	})
	return string.slice(0, -1)
}

export class HTTPTransport {
	get: HTTPRequest = (url, options = {}) => {
		return this.request(url, { ...options, method: 'GET' }, options.timeout)
	}
	put: HTTPRequest = (url, options = {}) => {
		return this.request(url, { ...options, method: 'PUT' }, options.timeout)
	}
	post: HTTPRequest = (url, options = {}) => {
		return this.request(url, { ...options, method: 'POST' }, options.timeout)
	}
	delete: HTTPRequest = (url, options = {}) => {
		return this.request(url, { ...options, method: 'DELETE' }, options.timeout)
	}
	// PUT, POST, DELETE

	// options:
	// headers — obj
	// data — obj
	request = (url, options = { method: 'GET' }, timeout = 5000) => {
		const { method, data, headers } = options

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()

			if (method === 'GET' && data) {
				xhr.open(method, url + queryStringify(data))
			} else {
				xhr.open(method, url)
			}

			if (headers) {
				Object.keys(headers).forEach((header) => {
					xhr.setRequestHeader(header, headers[header])
				})
			}

			const handleError = (err) => {
				console.log('Ошибка запроса')
				reject(err)
			}

			xhr.timeout = timeout
			xhr.onload = () => {
				resolve(xhr)
			}
			xhr.onabort = handleError
			xhr.onerror = handleError
			xhr.ontimeout = handleError

			if (method === 'GET' || !data) {
				xhr.send()
			} else {
				xhr.send(JSON.stringify(data))
			}
		})
	}
}
