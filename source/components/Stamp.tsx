import styled from 'styled-components'

const StampStyle = styled.button`
	position: absolute;
	border-radius: 1rem;
	right: 0.5rem;
	top: -2em;
	${({ clickable }) => clickable && `cursor: pointer`}
`

export default ({ number }) => (
	<StampStyle>
		<svg
			css="width:2.5rem"
			viewBox="0 0 72 72"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="var(--color)"
				d="M17.12 49.128A22.887 22.887 0 0 1 13 36c0-12.703 10.297-23 23-23s23 10.297 23 23-10.297 23-23 23c-3.758 0-7.302-.907-10.435-2.505l-4.814 2.052-5.728 2.443 1.084-6.132z"
			/>
			<path
				fill="none"
				stroke="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit={10}
				strokeWidth={2}
				d="M17.12 49.128A22.887 22.887 0 0 1 13 36c0-12.703 10.297-23 23-23s23 10.297 23 23-10.297 23-23 23c-3.758 0-7.302-.907-10.435-2.505l-4.814 2.052-5.728 2.443 1.084-6.132z"
			/>
			<text
				xmlSpace="preserve"
				style={{
					fontSize: '26.6667px',
					lineHeight: 1.25,
					fontFamily: 'Ubuntu',
					InkscapeFontSpecification: 'Ubuntu',
					letterSpacing: 0,
				}}
				x={28.883}
				y={45.06}
			>
				<tspan
					x={28.883}
					y={45.06}
					style={{
						fill: '#fff',
						fillOpacity: 1,
						fontWeight: 'bold',
					}}
				>
					{number}
				</tspan>
			</text>
		</svg>
	</StampStyle>
)
