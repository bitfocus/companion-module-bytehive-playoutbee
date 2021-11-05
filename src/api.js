const needle = require('needle')
const POST = ['play', 'pause', 'stop', 'select', 'loop', 'next']
const GET = ['clips', 'player', 'current']

const generateUrl = (ip, port, cmd, param = '') => `http://${ip}:${port}/api/${cmd}/${param}`

module.exports = {
	sendCommand({ cmd, param, timeout = 2000 }) {
		const url = generateUrl(this.config.ip, this.config.port, cmd, param)

		const method = GET.includes(cmd) ? 'get' : POST.includes(cmd) ? 'post' : 'head'

		return needle(method, url, { open_timeout: timeout, response_timeout: timeout }).then((res) => res.body)
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

	async getClips() {
		try {
			return await this.sendCommand({ cmd: 'clips' }).then((res) => res.body)
		} catch (error) {
			this.log('error', `getClips: Unable to get clips. ${error}`)
		}
		// [
		//     {
		//         "name": "Chrome Rings on Black Loop.mp4",
		//         "uri": "/Users/johnny/Movies/Chrome Rings on Black Loop.mp4",
		//         "length": "00:00:10:01"
		//     },
		// ]
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
		// {
		//     "speed": 100,
		//     "clipID": 0,
		//     "status": "stopped",
		//     "loop": false,
		//     "timecode": "00:00:00:00",
		//     "remainingtimecode": 10.04,
		//     "preview": false,
		//     "clips": [
		//         {
		//             "name": "Chrome Rings on Black Loop.mp4",
		//             "uri": "/Users/johnny/Movies/Chrome Rings on Black Loop.mp4",
		//             "length": "00:00:10:01"
		//         }
		//     ],
		//     "ended": "stop"
		// }
	},

	async getCurrentClip() {
		try {
			return await this.sendCommand({ cmd: 'currentClip' })
		} catch (error) {
			this.log('error', `Unable to get current clip. Error code:(${error.code}).`)
		}
		// {
		//     "name": "Chrome Rings on Black Loop.mp4",
		//     "uri": "/Users/johnny/Movies/Chrome Rings on Black Loop.mp4",
		//     "length": "00:00:10:01"
		// }
	},
}