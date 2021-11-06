module.exports = {
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'Companion Module for ByteHive PlayoutBee',
			},
			{
				type: 'textinput',
				id: 'ip',
				label: 'PlayoutBee IP',
				width: 6,
				regex: this.REGEX_IP,
				default: this.DEFAULT_IP,
				required: true,
			},
			{
				type: 'number',
				id: 'port',
				label: 'PlayoutBee REST Port',
				width: 6,
				min: 1024,
				max: 65535 ,
				default: 3000,
				required: true,
			},
			{
				type: 'number',
				id: 'interval',
				label: 'Interval in Milliseconds',
				width: 6,
				min: 100,
				max: 1000,
				default: 100,
				required: true,
			},
		]
	},
}
