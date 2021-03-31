import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { EngineContext } from '../../components/utils/EngineContext'
import { formatValue } from 'publicodes'
import styled from 'styled-components'

const Banner = styled.div`
	background: rgba(0, 0, 0, 0) linear-gradient(60deg, #b151dd 0%, #7875d9 100%)
		repeat scroll 0% 0%;
	color: white;
	font-size: 200%;
	padding: 0.6rem 1rem;
	text-align: center;
	width: 80%;
`

export default () => {
	const engine = useContext(EngineContext),
		evaluation = engine.evaluate('transport'),
		rules = useSelector((state) => state.rules),
		transport = rules['transport'],
		elements = transport.formule.somme.map((el) => ({
			...rules['transport . ' + el],

			name: el,
		}))

	return (
		<div>
			<h1>Coach CO2</h1>
			<p>{emoji('📆 ')} Année 2021</p>
			<Banner>Mon total : {formatValue(evaluation)}</Banner>
			<Banner
				css={`
					background: rgba(0, 0, 0, 0)
						linear-gradient(60deg, #10ac84 0%, #1dd1a1 100%) repeat scroll 0% 0%;
					width: 20%;
					font-size: 100%;
					padding: 0.4rem;
					margin: 1rem 0;
				`}
			>
				{emoji('🎯 ')}
				Objectif climat
			</Banner>
			<ul
				css={`
					display: flex;
					flex-direction: column;

					li {
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
					li img {
						font-size: 500%;
						margin: 0 1rem !important;
					}
					li:nth-child(2n) {
						justify-content: flex-end;
					}
				`}
			>
				{elements.map((el) => (
					<li key={el.name}>
						<div>{emoji(el.icônes || '')}</div>
						<div
							css={`
								display: flex;
								flex-direction: column;
								h3 {
									text-transform: capitalize;
								}
								> div {
									font-size: 150%;
								}
							`}
						>
							<h3>{el.name}</h3>
							<div>
								{formatValue(engine.evaluate('transport . ' + el.name))}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
