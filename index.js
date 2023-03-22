let a = {
	b: {
		c: {}
	}
}

a.b.c['d'] = class d {
	constructor() {
		console.log('d')
	}
}

let b = new a.b.c['d']()