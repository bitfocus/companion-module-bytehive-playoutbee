module.exports = {
	/**
	 * Replace with your instance wide constants
	 */
	initConstants() {
		this.defineConst('DEFAULT_IP', '127.0.0.1')
		this.defineConst('DEFAULT_HOST', 'playoutbee')
		this.defineConst('DEFAULT_PORT', 3000)
		this.defineConst('DEFAULT_VERSION', '0.9.4')
		this.defineConst('DEFAULT_INTERVAL', 100)
		this.defineConst('SUPPORTED_VERSIONS', ['0.9.3', '0.9.4'])
	},
}
