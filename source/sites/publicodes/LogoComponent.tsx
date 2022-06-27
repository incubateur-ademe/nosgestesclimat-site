import * as React from 'react'

const SvgComponent = (props) => (
	<svg
		width="210mm"
		height="210mm"
		viewBox="0 0 210 210"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<defs>
			<linearGradient
				xlinkHref="#a"
				id="d"
				gradientUnits="userSpaceOnUse"
				gradientTransform="scale(1.00299 -1.00299) rotate(38.34 608.852 -189.54)"
				x1={182.818}
				y1={184.334}
				x2={346.067}
				y2={184.334}
			/>
			<linearGradient id="a">
				<stop
					style={{
						stopColor: '#3843ff',
						stopOpacity: 0.80784315,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#d65585',
						stopOpacity: 1,
					}}
					offset={0.487}
				/>
				<stop
					style={{
						stopColor: '#fc9200',
						stopOpacity: 0.99607843,
					}}
					offset={0.868}
				/>
			</linearGradient>
			<linearGradient
				xlinkHref="#b"
				id="e"
				gradientUnits="userSpaceOnUse"
				gradientTransform="scale(1.00299 -1.00299) rotate(38.34 608.852 -189.54)"
				x1={182.548}
				y1={225.812}
				x2={304.496}
				y2={225.812}
			/>
			<linearGradient id="b">
				<stop
					style={{
						stopColor: '#4046f5',
						stopOpacity: 0.81568629,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#5987ff',
						stopOpacity: 1,
					}}
					offset={0.537}
				/>
				<stop
					style={{
						stopColor: '#2daa66',
						stopOpacity: 1,
					}}
					offset={1}
				/>
			</linearGradient>
			<linearGradient
				xlinkHref="#c"
				id="f"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(-256.418 347.351) scale(1.05348)"
				x1={215.079}
				y1={-184.757}
				x2={300.817}
				y2={-184.757}
			/>
			<linearGradient id="c">
				<stop
					style={{
						stopColor: '#ff4e25',
						stopOpacity: 1,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#fc9200',
						stopOpacity: 0.99607843,
					}}
					offset={1}
				/>
			</linearGradient>
		</defs>
		<path
			style={{
				fill: 'none',
				fillRule: 'evenodd',
				stroke: 'url(#d)',
				strokeWidth: 22.5672,
				strokeLinecap: 'butt',
				strokeDasharray: 'none',
			}}
			d="M164.633 64.778c25.126 31.769 19.741 77.89-12.028 103.017-31.769 25.126-78.529 19.38-103.655-12.388"
		/>
		<path
			style={{
				fill: 'none',
				fillRule: 'evenodd',
				stroke: 'url(#e)',
				strokeWidth: 22.5672,
				strokeLinecap: 'butt',
				strokeDasharray: 'none',
			}}
			d="M48.962 155.411C23.836 123.642 29.222 77.52 60.99 52.394c10.334-8.173 22.187-13.118 34.341-14.976"
		/>
		<circle
			style={{
				fill: '#2daa66',
				fillOpacity: 1,
				fillRule: 'evenodd',
				strokeWidth: 0.994319,
			}}
			cx={68.278}
			cy={96.595}
			r={22.077}
			transform="rotate(-38.34)"
		/>
		<circle
			style={{
				fill: 'url(#f)',
				fillOpacity: 1,
				fillRule: 'evenodd',
				strokeWidth: 0.79011,
			}}
			cx={15.325}
			cy={152.713}
			transform="rotate(-38.34)"
			r={45.162}
		/>
		<path
			style={{
				fill: '#fc9001',
				fillOpacity: 0.996078,
				stroke: 'none',
				strokeWidth: '.752239px',
				strokeLinecap: 'butt',
				strokeLinejoin: 'miter',
				strokeOpacity: 1,
			}}
			d="m171.606 55.555-32.255 25.51 9.515 19.775 33.042-26.232z"
		/>
	</svg>
)

export default SvgComponent
