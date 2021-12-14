module.exports = {
	variableDefinitions: [
		{
			label: 'Clip Id',
			name: 'clip_id',
			storeId: 'clipID',
			feedbacks: ['clip'],
			updateMore: ({ value, context }) => {
				return [{ name: 'clip_name', value: context.store.clips[value - 1]?.name }]
			},
		},
		{
			label: 'Clip Name',
			name: 'clip_name',
		},
		{ label: 'Status', name: 'status', storeId: 'status', feedbacks: ['status'] },
		{ label: 'Loop', name: 'loop', storeId: 'loop', feedbacks: ['loop'] },
		{
			label: 'Timecode',
			name: 'timecode',
			storeId: 'timecode',
			updateMore: ({ value }) => {
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
			updateMore: ({ value }) => {
				let remainder = parseInt(value)
				const ff = Math.ceil((value - Math.floor(value)) * 100)
				const hh = parseInt(remainder / 3600)

				remainder = remainder % 3600
				const mm = parseInt(remainder / 60)
				const ss = remainder % 60
				return [
					{ name: 'remaining_hh', value: hh.toString().padStart(2, '0') },
					{ name: 'remaining_mm', value: mm.toString().padStart(2, '0') },
					{ name: 'remaining_ss', value: ss.toString().padStart(2, '0') },
					{ name: 'remaining_ff', value: ff.toString().padStart(2, '0') },
				]
			},
		},
		{ label: 'Remaining Hours', name: 'remaining_hh' },
		{ label: 'Remaining Minutes', name: 'remaining_mm' },
		{ label: 'Remaining Seconds', name: 'remaining_ss' },
		{ label: 'Remaining Fraction', name: 'remaining_ff' },
	],

	initVariables() {
		this.setVariableDefinitions(this.variableDefinitions)

		// Set initial values
		this.variableDefinitions.forEach(({ name, storeId }) => {
			if (storeId) {
				this.updateVariable(name, this.store[storeId])
			}
		})
	},

	updateVariable(name, value) {
		const { storeId, feedbacks, updateMore } = this.variableDefinitions.find((item) => item.name === name)

		this.setVariable(name, value)

		if (storeId) {
			this.store[storeId] = value
		}

		if (typeof updateMore === 'function') {
			updateMore({ value: value, context: this }).forEach(({ name, value }) => {
				this.setVariable(name, value)
			})
		}

		if (feedbacks && Array.isArray(feedbacks)) {
			feedbacks.forEach((feedback) => this.checkFeedbacks(feedback))
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
						this.updateVariable('clip_name', this.store.clips[this.store.clipID].name)
						this.initActions()
						this.initFeedbacks()
					}
				}
			}
		}
	},
}
