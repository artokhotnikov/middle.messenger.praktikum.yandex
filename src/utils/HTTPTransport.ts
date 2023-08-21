const METHODS = {
	GET: 'GET',
	PUT: 'PUT',
	POST: 'POST',
	DELETE: 'DELETE',
}

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

class HTTPTransport {
	get = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.GET }, options.timeout)
	}
	put = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
	}
	post = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.POST }, options.timeout)
	}
	delete = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
	}
	// PUT, POST, DELETE

	// options:
	// headers — obj
	// data — obj
	request = (url, options = { method: METHODS.GET }, timeout = 5000) => {
		const { method, data, headers } = options

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()

			if (method === METHODS.GET && data) {
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

			if (method === METHODS.GET || !data) {
				xhr.send()
			} else {
				xhr.send(JSON.stringify(data))
			}
		})
	}
}

// eslint-disable-next-line no-unused-vars
function fetchWithRetry(url, options = { retries: 5 }) {
	let tries = 0

	const req = new HTTPTransport()

	const retrySend = () => {
		return req
			.get(url, options)
			.then((response) => {
				return response
			})
			.catch((error) => {
				tries += 1
				if (tries === options.retries) {
					throw new Error(error)
				}
				return retrySend()
			})
	}
	return retrySend()
}
