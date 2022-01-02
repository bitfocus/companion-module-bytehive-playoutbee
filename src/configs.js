module.exports = {
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				value: `
					<h4>Companion Module for ByteHive PlayoutBee</h4>
					<p>
						This module allows you to control an instance of PlayoutBee. 
					</p>
					<p>
						This module compatible with versions 0.9.3 and 0.9.4 only. Selecting the version
						below will enable actions, feedbacks and variables compatible with the selected
						version.
					</p>
				`,
			},
			{
				type: 'dropdown',
				id: 'version',
				label: 'What version of PlayoutBee are you currently using?',
				width: 6,
				choices: [
					{ id: '0.9.3', label: '0.9.3' },
					{ id: '0.9.4', label: '0.9.4' },
				],
				default: this.DEFAULT_VERSION,
			},
			{
				type: 'text',
				id: 'info',
				width: 12,
				value: '<h5>Connection Configuration</h5>',
			},
			{
				type: 'dropdown',
				id: 'host',
				label: 'Use an IP address or hostname?',
				width: 6,
				choices: [
					{ id: 'ip', label: 'IP address' },
					{ id: 'hostname', label: 'Hostname' },
				],
				default: 'ip',
			},
			{
				type: 'textinput',
				id: 'ip',
				label: 'PlayoutBee IP',
				width: 6,
				regex: this.REGEX_IP,
				default: this.DEFAULT_IP,
				required: true,
				isVisible: ({ host }) => host === 'ip',
			},
			{
				type: 'textinput',
				id: 'hostname',
				label: 'PlayoutBee Hostname',
				width: 6,
				default: this.DEFAULT_HOST,
				required: true,
				isVisible: ({ host }) => host === 'hostname',
			},
			{
				type: 'number',
				id: 'port',
				label: 'PlayoutBee REST Port',
				width: 6,
				min: 3000,
				max: 3000,
				default: this.DEFAULT_PORT,
				required: true,
			},
			{
				type: 'text',
				id: 'info',
				width: 12,
				value: '<h5>Feedback Configuration</h5>',
			},
			{
				type: 'dropdown',
				id: 'feedback',
				label: 'Enable feedback?',
				width: 6,
				choices: [
					{ id: true, label: 'Yes' },
					{ id: false, label: 'No' },
				],
				default: true,
			},
			{
				type: 'dropdown',
				id: 'interval',
				label: 'Polling Interval',
				width: 6,
				choices: [
					{ id: 100, label: 'Very Fast (100ms)' },
					{ id: 250, label: 'Fast (250ms)' },
					{ id: 500, label: 'Moderate (500ms)' },
					{ id: 1000, label: 'Slow (1000ms)' },
					{ id: 2000, label: 'Very Slow (2000ms)' },
					{ id: 0, label: 'Custom' },
				],
				default: this.DEFAULT_INTERVAL,
				isVisible: ({ feedback }) => feedback === true,
			},
			{
				type: 'number',
				id: 'customInterval',
				label: 'Custom Poll Interval in Milliseconds',
				width: 6,
				min: 100,
				max: 2000,
				default: 100,
				required: true,
				isVisible: ({ feedback, interval }) => feedback === true && interval === 0,
			},
		]
	},
}
