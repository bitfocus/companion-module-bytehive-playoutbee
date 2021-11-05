module.exports = {
	initFeedbacks() {
		/**
		 * Replace with your feedbacks
		 * see https://github.com/bitfocus/companion/wiki/Feedback
		 * use this.checkFeedbacks('sampleFeedback') to recheck the specified feedback
		 */
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
					choices: this.store.clips.map(({ name }, index) => ({ id: index, label: `${index}: ${name}` })),
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
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
					],
					default: 0,
				},
			],
			callback: ({ options }) => this.store.loop === Boolean(options.loop),
		}

		this.setFeedbackDefinitions(feedbacks)
	},
}
