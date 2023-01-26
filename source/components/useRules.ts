export default ({ optimized }: { optimized: Boolean }) => {
	if (!optimized) return { yo: '2', yi: 'yo + 3' }
	return { yo: '2', yi: '2 + 3' }
}
