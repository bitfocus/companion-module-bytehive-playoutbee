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

		this.runQueue = false

		this.store = {
			version: undefined,
			clipID: 0,
			status: 'stopped',
			timecode: '00:00:00:00',
			remainingtimecode: 0,
			preview: false,
			clips: [],
			loop: false,
		}

		this.timeout = {
			processNext: null,
			initRetry: null,
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
			this.version = await this.getVersion()
			this.debug({ version: this.version })
		} catch (error) {
			this.status(this.STATUS_ERROR, 'Unable to connect to get player version.')
			this.timeout.initRetry = setTimeout(() => {
				this.connectToPlayer()
			}, 5000)
			return
		}

		if (!this.COMPATIBLE_VERSIONS.includes(this.version)) {
			this.status(this.STATUS_ERROR, `Not compatible with v${this.version}`)
			this.log('error', `Only compatible with the following versions: ${this.COMPATIBLE_VERSIONS.join(', ')}`)
			return
		}

		try {
			await this.processQueue(true)
		} catch (error) {
			this.status(this.STATUS_ERROR, 'Unable to connect to player.')
			this.timeout.initRetry = setTimeout(() => {
				this.connectToPlayer()
			}, 5000)
			return
		}

		this.initActions()
		this.initVariables()
		this.initFeedbacks()
		this.initPresets()

		this.checkFeedbacks()

		this.runQueue = true
		this.processQueue()
		this.status(this.STATUS_OK)
	}

	async processQueue(init = false) {
		this.timeout.processNext = null

		try {
			const player = await this.getPlayer()
			this.updateVariablesFromPlayer(player)
			this.status(this.STATUS_OK)
		} catch (error) {
			if (init) {
				throw error
			}
			if (this.currentStatus !== this.STATUS_WARNING) {
				this.status(this.STATUS_WARNING, 'Trying to connect ...')
			}
		}

		if (this.runQueue) {
			this.timeout.processNext = setTimeout(() => {
				this.processQueue()
			}, this.config.interval)
		}

		return true
	}

	stopQueue() {
		this.runQueue = false

		if (this.timeout.processNext) {
			clearTimeout(this.timeout.processNext)
			this.timeout.processNext = null
		}
	}

	stopRetry() {
		if (this.timeout.initRetry) {
			clearTimeout(this.timeout.initRetry)
			this.timeout.initRetry = null
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
		this.stopRetry()
	}
}

module.exports = PayoutBee
