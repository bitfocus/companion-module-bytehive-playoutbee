const got = require('got')
const POST = ['play', 'pause', 'stop', 'select', 'loop', 'next', 'prev', 'setBlackout']
const GET = ['clips', 'player', 'current']

const generateUrl = (ip, port, cmd, param = '') => `http://${ip}:${port}/api/${cmd}/${param}`

module.exports = {
	getHost() {
		return this.config.host === undefined ? undefined : this.config[this.config.host]
	},

	sendCommand({ cmd, param, timeout = 2000 }) {
		if (this.getHost() === undefined) {
			console.log('Error: Missing IP Address or Hostname in config')
			return Promise.reject('Error: Missing IP Address or Hostname in config')
		}

		const url = generateUrl(this.getHost(), this.config.port, cmd, param)

		const method = GET.includes(cmd) ? 'GET' : POST.includes(cmd) ? 'POST' : 'HEAD'

		let options = { method, timeout }

		if (method === 'GET') {
			options = { ...options, responseType: 'json' }
		}

		return got(url, options).then(({ body }) => JSON.parse(body))
	},

	getVersion() {
		const url = `http://${this.getHost()}:${this.config.port}/version`
		return got(url, { method: 'GET', timeout: 2000 }).then(({ body }) => body)
	},

	play() {
		this.sendCommand({ cmd: 'play' }).catch((error) => {
			this.log('error', `play: Unable to play clip. ${error}`)
		})
	},

	pause() {
		this.sendCommand({ cmd: 'pause' }).catch((error) => {
			this.log('error', `pause: Unable to pause clip. ${error}`)
		})
	},

	stop() {
		this.sendCommand({ cmd: 'stop' }).catch((error) => {
			this.log('error', `stop: Unable to stop clip. ${error}`)
		})
	},

	select(id) {
		this.sendCommand({ cmd: 'select', param: id - 1 }).catch((error) => {
			this.log('error', `select: Unable to select clip ${id}. ${error}`)
		})
	},

	loop(state) {
		this.sendCommand({ cmd: 'loop', param: state ? 'on' : 'off' }).catch((error) => {
			this.log('error', `loop: Unable to set loop to "${state}". ${error}`)
		})
	},

	next() {
		this.sendCommand({ cmd: 'next' }).catch((error) => {
			this.log('error', `next: Unable to move to the next clip. ${error}`)
		})
	},

	prev() {
		this.sendCommand({ cmd: 'prev' }).catch((error) => {
			this.log('error', `next: Unable to move to the previous clip. ${error}`)
		})
	},

	setBlackout(state) {
		this.sendCommand({ cmd: 'setBlackout', param: state ? 'true' : 'false' }).catch((error) => {
			this.log('error', `next: Unable to move to the previous clip. ${error}`)
		})
	},

	async getClips() {
		try {
			return await this.sendCommand({ cmd: 'clips' })
		} catch (error) {
			this.log('error', `getClips: Unable to get clips. ${error}`)
		}
	},

	async getPlayer() {
		try {
			const player = await this.sendCommand({ cmd: 'player' })
			player.clipID = parseInt(player.clipID) + 1
			return player
		} catch (error) {
			this.log('error', `getPlayer: Unable to get player. ${error}`)
			throw error
		}
	},

	async getCurrentClip() {
		try {
			return await this.sendCommand({ cmd: 'currentClip' })
		} catch (error) {
			this.log('error', `Unable to get current clip. Error code:(${error.code}).`)
		}
	},
}
