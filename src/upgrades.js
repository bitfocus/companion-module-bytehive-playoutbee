module.exports = {
	v094(context, config, actions, feedbacks) {
		let upgraded = false
		const newConfigFields = [
			{ id: 'version', default: '0.9.3' },
			{ id: 'host', default: 'ip' },
			{ id: 'hostname', default: 'playoutbee' },
			{ id: 'feedback', default: true },
			{ id: 'customInterval', default: 100 },
		]

		// upgrade config fields
		for (const field of newConfigFields) {
			if (config[field.id] === undefined) {
				config[field.id] = field.default
				upgraded = true
			}
		}

		// set custom interval if necessary
		if (![100, 250, 500, 1000, 2000].includes(config.interval)) {
			config.customInterval = config.interval
			config.interval = 0
			upgraded = true
		}

		feedbacks.forEach((feedback) => {
			if (feedback.type === 'loop' && Number.isInteger(feedback.options.loop)) {
				feedback.options.loop = Boolean(feedback.options.loop)
				upgraded = true
			}
		})

		return upgraded
	},
}
