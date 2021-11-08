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

		actions.loop = {
			label: 'Set Loop',
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: [
						{ id: 'off', label: 'Off' },
						{ id: 'on', label: 'On' },
						{ id: 'toogle', label: 'Toogle' },
					],
					default: 'off',
				},
			],
			callback: ({ options }) => this.loop(options.state === 'toogle' ? !this.store.loop : options.state === 'on'),
		}

		actions.select = {
			label: 'Select Clip',
			options: [
				{
					type: 'dropdown',
					label: 'Clip',
					id: 'clip',
					choices: [
						...this.store.clips.map(({ name }, index) => ({ id: index + 1, label: `${index + 1}: ${name}` })),
						{ id: 0, label: 'Select using custom variable' },
					],
					default: this.store.clips.length ? 1 : 0,
				},
				{
					type: 'dropdown',
					label: 'Custom Variable',
					id: 'variable',
					choices:
						this.customVariables.length === 0
							? [{ id: 0, label: 'No variables defined' }]
							: Object.keys(this.customVariables).map((name, index) => ({ id: index, label: name })),
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

		this.setActions(actions)
	},
}
