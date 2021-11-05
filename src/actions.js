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
					choices: this.store.clips.map(({ name }, index) => ({ id: index, label: `${index}: ${name}` })),
					default: 0,
				},
			],
			callback: ({ options }) => this.select(options.clip),
		}

		this.setActions(actions)
	},
}
