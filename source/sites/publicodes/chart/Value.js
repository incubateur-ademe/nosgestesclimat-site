import { humanWeight } from '../HumanWeight'

export default ({ nodeValue, color, completed }) => {
	const [value, unit] = humanWeight(nodeValue, true)
	return (
		<span
			css={`
				color: ${color || 'var(--textColorOnWhite)'};
				font-weight: 600;
				display: flex;
				align-items: center;
			`}
		>
			{value}&nbsp;{unit}{' '}
			<img
				src="/images/2714.svg"
				css={`
					visibility: ${completed ? 'visible' : 'hidden'};
					display: inline;
					width: 1.2rem;
					margin-left: 0.2rem;
				`}
			/>
		</span>
	)
}
