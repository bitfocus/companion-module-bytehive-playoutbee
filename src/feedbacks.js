const { actionWhenFinishedList, choicesFromList, filterOnly } = require('./utils')

module.exports = {
	initFeedbacks() {
		const feedbacks = {}

		feedbacks.clip = {
			type: 'boolean',
			label: 'Current Clip',
			description: 'Set Color based on Current Clip',
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(255, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Clip',
					id: 'clip',
					choices: this.store.clips.map(({ name }, index) => ({ id: index + 1, label: `${index + 1}: ${name}` })),
					default: 0,
				},
			],
			callback: ({ options }) => parseInt(this.store.clipID) === options.clip,
		}

		feedbacks.status = {
			type: 'boolean',
			label: 'Player Status',
			description: "Set Color based on the Player's Status",
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(0, 128, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: [
						{ id: 'stopped', label: 'Stopped' },
						{ id: 'play', label: 'Playing' },
						{ id: 'paused', label: 'Paused' },
					],
					default: 'stopped',
				},
			],
			callback: ({ options }) => this.store.status === options.status,
		}

		feedbacks.loop = {
			type: 'boolean',
			label: 'Loop Status',
			description: "Set Color based on the Player's Loop Status",
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(0, 128, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Loop',
					id: 'loop',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
					],
					default: 0,
				},
			],
			callback: ({ options }) => this.store.loop === options.loop,
		}

		feedbacks.blackoutWhenPaused = {
			type: 'boolean',
			label: 'Blackout When Paused',
			description: "Set Color based on the Player's Blackout Status",
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(0, 128, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Blackout',
					id: 'blackout',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
					],
					default: 0,
				},
			],
			callback: ({ options }) => this.store.blackout === options.blackout,
			only: () => this.config.version >= '0.9.4',
		}

		feedbacks.actionWhenFinished = {
			type: 'boolean',
			label: 'Action when Video is Finished',
			description: "Set Color based on the Player's Action Status",
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(0, 128, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: choicesFromList(actionWhenFinishedList),
					default: 'off',
				},
			],
			callback: ({ options }) => this.store.blackout === options.blackout,
			only: () => this.config.version >= '0.9.4',
		}

		this.setFeedbackDefinitions(filterOnly(feedbacks))
	},
}
