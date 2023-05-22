export const formatDataForDB = (simulation) => {
	const simulationFormatted = { ...simulation }
	Object.entries(
		simulationFormatted.situation as { [key: string]: any }
	).reduce((acc: { [key: string]: any }, [key, value]: [string, any]) => {
		acc[key.replaceAll(' . ', '_')] = value
		return acc
	}, {})
}
