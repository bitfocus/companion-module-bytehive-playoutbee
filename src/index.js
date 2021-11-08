const instance_skel = require('../../../instance_skel')

const configs = require('./configs')
const actions = require('./actions')
const constants = require('./constants')
const presets = require('./presets')
const variables = require('./variables')
const feedbacks = require('./feedbacks')
const api = require('./api')

class PayoutBee extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...configs,
			...actions,
			...constants,
			...presets,
			...variables,
			...feedbacks,
			...api,
		})

		this.config = config

		this.store = {
			clipID: 0,
			status: 'stopped',
			timecode: '00:00:00:00',
			remainingtimecode: 0,
			preview: false,
			clips: [],
			loop: false,
			interval: null,
		}
		this.initConstants()

		this.customVariables = {}
		this.customVariableUpdate()
		system.on('custom_variables_update', (variables) => {
			this.customVariableUpdate(variables)
			this.initActions()
		})
	}

	async init() {
		this.connectToPlayer()
	}

	updateConfig(config) {
		this.config = config
		this.stopQueue()
		this.connectToPlayer()
	}

	async connectToPlayer() {
		if (this.config.ip === undefined) {
			this.status(this.STATUS_UNKNOWN, 'Needs IP')
			return
		}
		this.status(this.STATUS_UNKNOWN, 'Conecting...')
		if (await this.updateFromPlayer()) {
			this.initActions()
			this.initVariables()
			this.initFeedbacks()
			this.initPresets()

			this.checkFeedbacks()

			this.startQueue()
			this.status(this.STATUS_OK)
			return
		}
		this.status(this.STATUS_ERROR)
		this.log('error', "init: Can't connect to player")
	}

	startQueue() {
		let working = false

		if (this.store.interval) {
			this.log('warn', 'Attempting to start queue while already running')
			return
		}

		this.store.interval = setInterval(async () => {
			if (working) {
				return
			}
			working = true
			try {
				const player = await this.getPlayer()
				this.updateVariablesFromPlayer(player)
			} catch (error) {
				console.log(`${new Date()}: ${error}`)
				this.status(this.STATUS_ERROR, error)
				this.stopQueue()
			}
			working = false
		}, this.config.interval)

		this.log('debug', 'Started queue interval')
	}

	async updateFromPlayer() {
		try {
			const player = await this.getPlayer()
			this.updateVariablesFromPlayer(player)
			return true
		} catch (error) {
			this.status(this.STATUS_ERROR, error)
			this.stopQueue()
		}
		return false
	}

	stopQueue() {
		if (this.store.interval) {
			clearInterval(this.store.interval)
			this.store.interval = null
			this.log('debug', 'Stopped queue interval')
		}
	}

	customVariableUpdate(variables) {
		if (variables) {
			this.customVariables = variables
		} else {
			this.system.emit('custom_variables_get', (variables) => {
				this.customVariables = variables
			})
		}
	}

	destroy() {
		this.stopQueue()
	}
}

module.exports = PayoutBee
