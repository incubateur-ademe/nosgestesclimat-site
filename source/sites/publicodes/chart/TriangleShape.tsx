import * as React from 'react'

const TriangleShape = ({ color }) => (
	<svg
		width="210mm"
		height="210mm"
		viewBox="0 0 210 210"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			style={{
				fill: color,
				fillOpacity: 1,
				stroke: 'none',
				strokeWidth: '.264583px',
				strokeLinecap: 'butt',
				strokeLinejoin: 'miter',
				strokeOpacity: 1,
			}}
			d="M6.095 9.13H202.28l-98.743 193.705Z"
		/>
	</svg>
)

export default TriangleShape
