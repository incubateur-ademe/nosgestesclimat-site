export default (header, jsonList) => {
	const lines = jsonList.map((data) =>
		header.map((headerKey) => data[headerKey])
	)
	const csv = [separate(header), ...lines.map((list) => separate(list))].join(
		'\r\n'
	)
	return csv
}
const guillemet = '"'
const separate = (line) =>
	guillemet + line.join(`${guillemet};${guillemet}`) + guillemet
