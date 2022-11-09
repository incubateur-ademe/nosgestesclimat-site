import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { humanWeight } from '../../../sites/publicodes/HumanWeight'

export default function TotalChart(props) {
	const { t, i18n } = useTranslation()
	const maxScore = Math.max(...props.flatScoreArray),
		minValue = 2000, // 2 tonnes, the ultimate objective
		max = humanWeight({ t, i18n }, maxScore, true).join(' '),
		min = humanWeight({ t, i18n }, minValue, true).join(' ')

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
						title={humanWeight({ t, i18n }, elt, true).join(' ')}
						aria-label={humanWeight({ t, i18n }, elt, true).join(' ')}
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
