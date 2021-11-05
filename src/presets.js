const images = require('./images')

module.exports = {
	initPresets() {
		const presets = []
		const timecodeParts = ['HH', 'MM', 'SS', 'FF']

		// Media Controls
		presets.push({
			category: 'Media Controls',
			label: 'Play',
			bank: {
				style: 'png',
				text: '',
				size: 'auto',
				alignment: 'center:center',
				pngalignment: 'center:center',
				color: 16777215,
				bgcolor: 0,
				latch: false,
				relative_delay: false,
				png64: images.play,
			},
			actions: [{ action: 'play', options: {} }],
			feedbacks: [
				{
					type: 'status',
					options: { status: 'play' },
					style: { color: 16777215, bgcolor: 32768 },
				},
			],
		})

		presets.push({
			category: 'Media Controls',
			label: 'Pause',
			bank: {
				style: 'png',
				text: '',
				size: 'auto',
				alignment: 'center:center',
				pngalignment: 'center:center',
				color: 16777215,
				bgcolor: 0,
				latch: false,
				relative_delay: false,
				png64: images.pause,
			},
			actions: [{ action: 'pause', options: {} }],
			feedbacks: [
				{
					type: 'status',
					options: { status: 'paused' },
					style: { color: 16777215, bgcolor: 32768 },
				},
			],
		})

		presets.push({
			category: 'Media Controls',
			label: 'Stop',
			bank: {
				style: 'png',
				text: '',
				size: 'auto',
				alignment: 'center:center',
				pngalignment: 'center:center',
				color: 16777215,
				bgcolor: 0,
				latch: false,
				relative_delay: false,
				png64: images.stop,
			},
			actions: [{ action: 'stop', options: {} }],
			feedbacks: [
				{
					type: 'status',
					options: { status: 'stopped' },
					style: { color: 16777215, bgcolor: 32768 },
				},
			],
		})

		presets.push({
			category: 'Media Controls',
			label: 'Next Clip',
			bank: {
				style: 'png',
				text: '',
				size: 'auto',
				alignment: 'center:center',
				pngalignment: 'center:center',
				color: 16777215,
				bgcolor: 0,
				latch: false,
				relative_delay: false,
				png64: images.next,
			},
			actions: [{ action: 'next', options: {} }],
			feedbacks: [],
		})

		presets.push({
			category: 'Media Controls',
			label: 'Loop',
			bank: {
				style: 'png',
				text: 'ON',
				size: '7',
				alignment: 'center:center',
				pngalignment: 'center:center',
				color: 16777215,
				bgcolor: 0,
				latch: false,
				relative_delay: false,
				png64: images.loop,
			},
			actions: [{ action: 'loop', options: { state: 'toogle' } }],
			feedbacks: [
				{
					type: 'loop',
					options: { loop: 1 },
					style: { color: 16777215, bgcolor: 32768, text: 'ON' },
				},
				{
					type: 'loop',
					options: { loop: 0 },
					style: { text: 'OFF' },
				},
			],
		})

		// Timecode
		timecodeParts.forEach((part) => {
			presets.push({
				category: 'Timecode',
				label: `Timecode ${part}`,
				bank: {
					style: 'png',
					text: `$(playoutbee:timecode_${part.toLowerCase()})`,
					size: '30',
					alignment: 'center:center',
					pngalignment: 'center:center',
					color: 16777215,
					bgcolor: 0,
					latch: false,
					relative_delay: false,
					png64: images[`timecode${part}`],
				},
				actions: [],
				feedbacks: [],
			})
	
		})

		timecodeParts.forEach((part) => {
			presets.push({
				category: 'Timecode',
				label: `Remaining ${part}`,
				bank: {
					style: 'png',
					text: `$(playoutbee:remaining_${part.toLowerCase()})`,
					size: '30',
					alignment: 'center:center',
					pngalignment: 'center:center',
					color: 16777215,
					bgcolor: 0,
					latch: false,
					relative_delay: false,
					png64: images[`remaining${part}`],
				},
				actions: [],
				feedbacks: [],
			})
	
		})

		// Select Clips
		for (let index = 1; index <= 50; index++) {
			presets.push({
				category: 'Select Clips',
				label: 'Select Clip',
				bank: {
					style: 'png',
					text: index.toString(),
					size: '18',
					alignment: 'center:center',
					pngalignment: 'center:center',
					color: 16777215,
					bgcolor: 0,
					latch: false,
					relative_delay: false,
					png64: images.clip,
				},
				actions: [{ action: 'select', options: { clip: index } }],
				feedbacks: [
					{
						type: 'clip',
						options: { clip: index },
						style: { color: 16777215, bgcolor: 32768 },
					},
				],
			})
	
		}

		this.setPresetDefinitions(presets)
	},
}
