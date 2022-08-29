export default ({ element }) => (
	<img
		src={`/images/model/${element.dottedName}.svg`}
		onError={({ currentTarget }) => {
			currentTarget.onerror = null
			currentTarget.src = '/images/three-dots.svg'
		}}
	/>
)
