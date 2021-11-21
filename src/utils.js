const isFunction = (x) => typeof x === 'function'
const isObject = (x) => typeof x === 'function'

const choicesFromList = (list) =>
	list.map((label, id) => {
		id, label
	})

const onOffFromBoolean = (value) => (value === true ? 'ON' : 'OFF')

const filterOnly = (list) => {
	if (Array.isArray(list)) {
		return list.filter((item) => (isFunction(item.only) ? item.only() : true))
	}

	if (isObject(list)) {
		return Object.fromEntries(Object.entries(list).filter(([, item]) => (isFunction(item.only) ? item.only() : true)))
	}

	return list
}

const actionWhenFinishedList = ['Go to First Frame', 'Pause on Last Frame', 'Go to Next', 'Play Next']

module.exports = {
	choicesFromList,
	isFunction,
	isObject,
	filterOnly,
	onOffFromBoolean,

	actionWhenFinishedList,
}
