import emoji from 'react-easy-emoji'
export default ({ emoji: e, message, inline, image }) => (
	<div
		className="ui__ card"
		css={`
			max-width: 26rem;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			${inline &&
			`flex-direction: row; justify-content: start; max-width: 100%; p {margin: 0}`}
		`}
	>
		{e ? (
			<span
				css={`
					img {
						font-size: 300%;
						margin: 0.6rem !important;
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
				margin: 1rem 0;
			`}
		>
			{message}
		</div>
	</div>
)
