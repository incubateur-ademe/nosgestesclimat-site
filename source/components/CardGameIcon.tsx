export default ({ number = 0 }) => (
	<svg
		css="width: 2rem; height: auto"
		aria-hidden="true"
		width="210mm"
		height="210mm"
		viewBox="0 0 210 210"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			style={{
				fill: 'var(--lightColor)',
				fillOpacity: 0.996078,
				fillRule: 'evenodd',
				stroke: 'var(--darkColor)',
				strokeWidth: 7.2062,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				strokeMiterlimit: 19.2,
				strokeDasharray: 'none',
				strokeOpacity: 1,
			}}
			width={105.196}
			height={151.336}
			x={-6.543}
			y={61.501}
			ry={13.789}
			transform="matrix(.9632 -.26876 .34952 .93693 0 0)"
		/>
		<rect
			style={{
				fill: 'var(--lightColor)',
				fillOpacity: 0.996078,
				fillRule: 'evenodd',
				stroke: 'var(--darkColor)',
				strokeWidth: 7.19653,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				strokeMiterlimit: 19.2,
				strokeDasharray: 'none',
				strokeOpacity: 1,
			}}
			width={106.168}
			height={149.549}
			x={36.923}
			y={46.396}
			ry={13.626}
			transform="matrix(.99154 -.12978 .17238 .98503 0 0)"
		/>
		<rect
			style={{
				fill: number > 0 ? '#16a085' : '#fff',
				fillOpacity: 0.997404,
				fillRule: 'evenodd',
				stroke: 'var(--darkColor)',
				strokeWidth: 10.1932,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				strokeMiterlimit: 19.2,
				strokeDasharray: 'none',
				strokeOpacity: 1,
			}}
			width={106.469}
			height={148.988}
			x={76.231}
			y={26.167}
			ry={13.575}
		/>
		<text
			xmlSpace="preserve"
			style={{
				fontSize: '100',
				lineHeight: 1.25,
				letterSpacing: 0,
				strokeWidth: 0.385599,
				fill: 'white',
				fontWeight: 'bold',
			}}
		>
			<tspan
				style={{
					fontSize: '102.827px',
					strokeWidth: 0.385599,
				}}
				x={100}
				y={135}
			>
				{number}
			</tspan>
		</text>
	</svg>
)
