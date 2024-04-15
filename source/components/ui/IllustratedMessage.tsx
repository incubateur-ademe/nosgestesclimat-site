import emoji from 'react-easy-emoji'

export default ({
	emoji: e,
	message,
	inline,
	image,
	width,
	direction,
	backgroundcolor,
}) => (
	<div
		className="ui__ card"
		css={`
			padding-top: 1rem;
			background-color: ${backgroundcolor} !important;
			max-width: ${width || '26rem'};
			margin: 5px auto;
			margin-bottom: 1rem;
			display: flex;
			flex-direction: column;
			@media (min-width: 1200px) {
				flex-direction: ${direction || 'column'};
			}
			align-items: center;
			${inline &&
			'flex-direction: row; justify-content: start; max-width: 100%; p {margin: 0}'}
		`}
	>
		{e ? (
			<span
				css={`
					img {
						font-size: 300%;
					}
				`}
			>
				{emoji(e)}
			</span>
		) : (
			<img
				css={`
					width: 4rem;
				`}
				src={image}
			/>
		)}

		<div
			css={`
				margin: ${direction === 'row' ? '1rem' : '1rem 0'};
			`}
		>
			{message}
		</div>
	</div>
)
