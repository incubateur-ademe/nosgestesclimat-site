import emoji from 'react-easy-emoji'
import { humanWeight } from '../../../sites/publicodes/HumanWeight'
import { formatValue } from 'publicodes'

export default function TotalChart(props) {
	const maxScore = Math.max(...props.flatScoreArray),
		minValue = 2000, // 2 tonnes, the ultimate objective
		max = humanWeight(maxScore, true).join(' '),
		min = humanWeight(minValue, true).join(' ')
	return (
		<div>
			<ul
				title="Empreinte totale"
				css={`
					width: 100%;
					position: relative;
					margin: 0 auto;
					border: 2px solid black;
					height: 2rem;
					list-style-type: none;
					li {
						position: absolute;
					}
				`}
			>
				{props.flatScoreArray.map((elt, index) => (
					<li
						key={index}
						css={`
							height: 100%;
							width: 10px;
							margin-left: -5px;
							left: ${((elt - minValue) / (maxScore - minValue)) * 100}%;
							background: var(--color);
							opacity: 0.03;
						`}
						title={humanWeight(elt, true).join(' ')}
						aria-label={humanWeight(elt, true).join(' ')}
					></li>
				))}
			</ul>
			<div css="display: flex; justify-content: space-between; width: 100%">
				<small key="legendLeft">
					{emoji('🎯 ')}
					{min}
				</small>
				<small key="legendRight">{max}</small>
			</div>
		</div>
	)
}
