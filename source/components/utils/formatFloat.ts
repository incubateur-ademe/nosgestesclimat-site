export const formatFloat = ({
	number,
	locale = 'fr-FR',
	maximumFractionDigits = 2,
}) => {
	return number.toLocaleString(locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits,
	})
}
