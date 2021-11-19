const { Mutex, E_CANCELED } = require('async-mutex')

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

		this.updatingState = new Mutex()

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

	init() {
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
		this.status(this.STATUS_UNKNOWN, 'Connecting...')

		try {
			await this.updateFromPlayer()
		} catch (error) {
			this.log('error', `Unable to establish connection to player via ${this.config.ip}`)
			this.status(this.STATUS_ERROR)
			return
		}

		this.initActions()
		this.initVariables()
		this.initFeedbacks()
		this.initPresets()

		this.checkFeedbacks()

		this.startQueue()
		this.status(this.STATUS_OK)
	}

	startQueue() {
		let errorCount = 0

		if (this.store.interval) {
			this.log('warn', 'Attempting to start queue while another already running')
			return
		}

		this.store.interval = setInterval(async () => {
			await this.updatingState.runExclusive(async () => {
				try {
					await this.updateFromPlayer()
					errorCount = 0
				} catch (error) {
					if (error === E_CANCELED) {
						this.log('debug', `More than one attempt to update state within ${this.config.interval} milliseconds`)
						return
					}

					errorCount += 1
					this.log('error', `${error} (${errorCount})`)

					if (errorCount >= 10) {
						this.log('error', 'Too many consecutive errors. Please check configuration.')
						this.stopQueue()
					}
				}
			})
		}, this.config.interval)
	}

	async updateFromPlayer() {
		const player = await this.getPlayer()
		this.updateVariablesFromPlayer(player)
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
