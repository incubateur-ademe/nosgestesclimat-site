export default ({ element }) => (
	<img
		css={`
			filter: grayscale(1) invert(1) brightness(1.8);
			width: 2.5rem;
			height: auto;
		`}
		src={`/images/model/${element.dottedName}.svg`}
		onError={({ currentTarget }) => {
			currentTarget.onerror = null
			currentTarget.src = '/images/three-dots.svg'
		}}
	/>
)
