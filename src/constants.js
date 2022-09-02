module.exports = {
	/**
	 * Replace with your instance wide constants
	 */
	initConstants() {
		this.defineConst('DEFAULT_IP', '127.0.0.1')
		this.defineConst('DEFAULT_PORT', '3000')
		this.defineConst('COMPATIBLE_VERSIONS', ['0.9.3', '0.9.4'])
	},
}
