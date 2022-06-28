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
				gradientTransform="matrix(.82906 -.6557 -.6557 -.82906 7.543 438.274)"
				x1={182.818}
				y1={184.334}
				x2={346.067}
				y2={184.334}
			/>
			<linearGradient id="a">
				<stop
					style={{
						stopColor: '#5f47e2',
						stopOpacity: 0.85490197,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#d65585',
						stopOpacity: 1,
					}}
					offset={0.524}
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
				gradientTransform="matrix(.82906 -.6557 -.6557 -.82906 7.543 438.274)"
				x1={182.548}
				y1={225.812}
				x2={304.496}
				y2={225.812}
			/>
			<linearGradient id="b">
				<stop
					style={{
						stopColor: '#6b48d9',
						stopOpacity: 0.87058824,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#5987ff',
						stopOpacity: 1,
					}}
					offset={0.643}
				/>
				<stop
					style={{
						stopColor: '#2daa66',
						stopOpacity: 1,
					}}
					offset={0.916}
				/>
			</linearGradient>
			<linearGradient
				xlinkHref="#c"
				id="f"
				gradientUnits="userSpaceOnUse"
				gradientTransform="matrix(1.11023 0 0 1.11023 -270.686 358.418)"
				x1={215.079}
				y1={-184.757}
				x2={300.817}
				y2={-184.757}
			/>
			<linearGradient id="c">
				<stop
					style={{
						stopColor: '#ff3927',
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
		<g transform="matrix(.96406 0 0 .96406 5.204 3.883)">
			<path
				style={{
					fill: 'none',
					fillRule: 'evenodd',
					stroke: 'url(#d)',
					strokeWidth: 23.7829,
					strokeLinecap: 'butt',
					strokeDasharray: 'none',
				}}
				d="M166.536 64.11c26.479 33.48 20.804 82.087-12.677 108.566-33.48 26.48-82.759 20.425-109.238-13.055"
			/>
			<path
				style={{
					fill: 'none',
					fillRule: 'evenodd',
					stroke: 'url(#e)',
					strokeWidth: 23.7829,
					strokeLinecap: 'butt',
					strokeDasharray: 'none',
				}}
				d="M44.633 159.625c-26.48-33.48-20.804-82.087 12.676-108.566 10.89-8.614 23.382-13.825 36.191-15.783"
			/>
			<circle
				style={{
					fill: '#2daa66',
					fillOpacity: 1,
					fillRule: 'evenodd',
					strokeWidth: 1.04788,
				}}
				cx={68.616}
				cy={93.856}
				r={23.267}
				transform="rotate(-38.34)"
			/>
			<circle
				style={{
					fill: 'url(#f)',
					fillOpacity: 1,
					fillRule: 'evenodd',
					strokeWidth: 0.832673,
				}}
				cx={15.696}
				cy={153.294}
				transform="rotate(-38.34)"
				r={47.595}
			/>
			<path
				style={{
					fill: '#fc9001',
					fillOpacity: 0.996078,
					stroke: 'none',
					strokeWidth: '.792763px',
					strokeLinecap: 'butt',
					strokeLinejoin: 'miter',
					strokeOpacity: 1,
				}}
				d="M167.523 48.087 134.71 72.292l11.28 22.018 36.526-26.654-6.642-10.904c-4.142-5.05-8.35-8.665-8.35-8.665z"
			/>
		</g>
	</svg>
)

export default SvgComponent
