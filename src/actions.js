const { actionWhenFinishedList, choicesFromList, filterOnly } = require('./utils')

module.exports = {
	initActions() {
		const actions = {}

		actions.play = {
			label: 'Play',
			callback: () => this.play(),
		}

		actions.pause = {
			label: 'Pause',
			callback: () => this.pause(),
		}

		actions.stop = {
			label: 'Stop',
			callback: () => this.stop(),
		}

		actions.next = {
			label: 'Next',
			callback: () => this.next(),
		}

		actions.prev = {
			label: 'Previous',
			only: () => this.config.version >= '0.9.4',
			callback: () => this.prev(),
		}

		actions.setBlackout = {
			label: 'Set Blackout When Paused',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: 'off', label: 'Off' },
						{ id: 'on', label: 'On' },
						{ id: 'toogle', label: 'Toogle' }, // TODO: Waiting for blackout state
					],
					default: 'off',
				},
			],
			only: () => this.config.version >= '0.9.4',
			callback: ({ options }) =>
				this.setBlackout(options.state === 'toogle' ? !this.store.blackout : options.state === 'on'),
		}

		actions.setAction = {
			label: 'Set Action when Video is Finished',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: choicesFromList(actionWhenFinishedList),
					default: 'off',
				},
			],
			only: () => this.config.version >= '0.9.4',
			callback: ({ options }) => this.setAction(options.state),
		}

		actions.loop = {
			label: 'Set Loop',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
						{ id: 'toogle', label: 'Toogle' },
					],
					default: 'off',
				},
			],
			callback: ({ options }) => this.loop(options.state === 'toogle' ? !this.store.loop : options.state),
		}

		actions.select = {
			label: 'Select Clip',
			options: [
				{
					type: 'dropdown',
					label: 'Clip',
					id: 'clip',
					choices: [
						{ id: 0, label: 'Select using custom variable' },
						...[...Array(this.config.maxClips).keys()].map((index) => {
							const name = this.store.clips[index]?.name || 'Clip ' + (index + 1)
							return { id: index + 1, label: `${index + 1}: ${name}` }
						}),
					],
					default: this.store.clips.length ? 1 : 0,
				},
				{
					type: 'dropdown',
					label: 'Custom Variable',
					id: 'variable',
					choices: [
						{ id: 0, label: 'No variable selected' },
						...Object.keys(this.customVariables).map((name, index) => ({ id: (index + 1), label: name })),
					],
					default: 0,
				},
			],
			callback: ({ options }) => {
				const customVariables = Object.keys(this.customVariables)

				if (options.clip === 0) {
					if (customVariables.length === 0) {
						return this.log('warn', 'There are no custom variables defined')
					} else {
						const variableName = customVariables[options.variable]
						this.system.emit('variable_get', 'internal', `custom_${variableName}`, (value) => {
							const clip = parseInt(value)
							if (Number.isNaN(clip)) {
								return this.log('warn', `Custom variable "${variableName}" doesn't contain a valid clip number`)
							}
							this.select(clip)
						})
					}
				} else {
					this.select(options.clip)
				}
			},
		}

		this.setActions(filterOnly(actions))
	},
}
