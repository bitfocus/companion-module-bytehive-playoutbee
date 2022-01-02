const { onOffFromBoolean, isFunction, filterOnly } = require('./utils')

const actionWhenFinished = ['Go to First Frame', 'Pause on Last Frame', 'Go to Next', 'Play Next']

module.exports = {
	initVariables() {
		const variableDefinitionsAll = [
			{
				label: 'Clip Id',
				name: 'clip_id',
				storeId: 'clipID',
				feedbacks: ['clip'],
				updateMore: (value) => [{ name: 'clip_name', value: this.store.clips[value - 1]?.name }],
			},
			{
				label: 'Clip Name',
				name: 'clip_name',
			},
			{ label: 'Status', name: 'status', storeId: 'status', feedbacks: ['status'] },
			{
				label: 'Loop',
				name: 'loop',
				getValue: onOffFromBoolean,
				storeId: 'loop',
				feedbacks: ['loop'],
			},
			{
				label: 'Blackout When Paused',
				name: 'blackout_status',
				getValue: onOffFromBoolean,
				storeId: 'blackout', // TODO: Check with Jonas adds feature
				feedbacks: ['blackoutWhenPaused'],
				only: () => this.config.version >= '0.9.4',
			},
			{
				label: 'Action When Finished',
				name: 'action_status',
				getValue: (value) => actionWhenFinished[value],
				storeId: 'action', // TODO: Check with Jonas adds feature
				feedbacks: ['actionWhenFinished'],
				only: () => this.config.version >= '0.9.4',
			},
			{
				label: 'Timecode',
				name: 'timecode',
				storeId: 'timecode',
				updateMore: (value) => {
					const parts = value.split(':')
					return [
						{ name: 'timecode_hh', value: parts[0] },
						{ name: 'timecode_mm', value: parts[1] },
						{ name: 'timecode_ss', value: parts[2] },
						{ name: 'timecode_ff', value: parts[3] },
					]
				},
			},
			{ label: 'Timecode Hours', name: 'timecode_hh' },
			{ label: 'Timecode Minutes', name: 'timecode_mm' },
			{ label: 'Timecode Seconds', name: 'timecode_ss' },
			{ label: 'Timecode Frames', name: 'timecode_ff' },
			{
				label: 'Remaining Timecode',
				name: 'remaining_timecode',
				storeId: 'remainingtimecode',
				updateMore: (value) => {
					if (this.config.version === '0.9.3') {
						let remainder = parseInt(value)
						const ff = Math.ceil((value - Math.floor(value)) * 100)
						const hh = parseInt(remainder / 360)

						remainder = remainder % 360
						const mm = parseInt(remainder / 60)
						const ss = remainder % 60
						return [
							{ name: 'remaining_hh', value: hh.toString().padStart(2, '0') },
							{ name: 'remaining_mm', value: mm.toString().padStart(2, '0') },
							{ name: 'remaining_ss', value: ss.toString().padStart(2, '0') },
							{ name: 'remaining_ff', value: ff.toString().padStart(2, '0') },
						]
					}

					const parts = value.split(':')
					return [
						{ name: 'remaining_hh', value: parts[0] },
						{ name: 'remaining_mm', value: parts[1] },
						{ name: 'remaining_ss', value: parts[2] },
						{ name: 'remaining_ff', value: parts[3] },
					]
				},
			},
			{ label: 'Remaining Hours', name: 'remaining_hh' },
			{ label: 'Remaining Minutes', name: 'remaining_mm' },
			{ label: 'Remaining Seconds', name: 'remaining_ss' },
			{ label: 'Remaining Fraction', name: 'remaining_ff' },
		].concat(
			Array(this.store.clips?.length || 0)
				.fill( { label: undefined, name: undefined } )
				.map( (e, index) => {
					return { label: `Clip ${index + 1} Name`, name: `clip_${index + 1}_name` }
				})
		)
 
		this.variableDefinitions = filterOnly(variableDefinitionsAll)

		this.setVariableDefinitions(this.variableDefinitions)

		// Set initial values
		this.variableDefinitions.forEach(({ name, storeId }) => {
			if (storeId) {
				this.updateVariable(name, this.store[storeId])
			}
		})
	},

	updateVariable(name, value) {
		const variable = this.variableDefinitions.find((item) => item.name === name)

		if (isFunction(variable.getValue)) {
			this.setVariable(name, variable.getValue(value))
		} else {
			this.setVariable(name, value)
		}

		if (variable.storeId) {
			this.store[variable.storeId] = value
		}

		if (isFunction(variable.updateMore)) {
			variable.updateMore(value).forEach(({ name, value }) => {
				this.setVariable(name, value)
			})
		}

		if (Array.isArray(variable.feedbacks)) {
			variable.feedbacks.forEach((feedback) => this.checkFeedbacks(feedback))
		}
	},

	updateVariablesFromPlayer(player) {
		for (const key in player) {
			const newValue = player[key]
			const variable = this.variableDefinitions.find((variable) => key === variable.storeId)

			if (variable) {
				const oldValue = this.store[variable.storeId]
				if (newValue !== oldValue) {
					this.updateVariable(variable.name, newValue)
				}
			} else if (key in this.store) {
				const oldValue = this.store[key]
				if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
					this.store[key] = newValue
					if (key === 'clips') {
						this.initVariables()
						this.updateVariable('clip_name', this.store.clips[this.store.clipID].name)
						this.store.clips.forEach((clip, index) => this.updateVariable(`clip_${index + 1}_name`, clip.name))
						this.initActions()
						this.initFeedbacks()
					}
				}
			}
		}
	},
}
