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
				x1={164.354}
				y1={-272.853}
				x2={334.941}
				y2={-272.853}
				gradientUnits="userSpaceOnUse"
				gradientTransform="matrix(1.02926 0 0 -1.02926 -151.484 -176.62)"
			/>
			<linearGradient id="a">
				<stop
					style={{
						stopColor: '#443fff',
						stopOpacity: 0.96862745,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#1e4aff',
						stopOpacity: 1,
					}}
					offset={1}
				/>
			</linearGradient>
			<linearGradient
				xlinkHref="#b"
				id="e"
				gradientUnits="userSpaceOnUse"
				x1={164.354}
				y1={-272.853}
				x2={334.941}
				y2={-272.853}
				gradientTransform="matrix(1.02926 0 0 -1.02926 -151.469 -176.616)"
			/>
			<linearGradient id="b">
				<stop
					style={{
						stopColor: '#3d41ff',
						stopOpacity: 0.81568629,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#ac1bff',
						stopOpacity: 1,
					}}
					offset={1}
				/>
			</linearGradient>
			<linearGradient
				xlinkHref="#c"
				id="f"
				gradientUnits="userSpaceOnUse"
				gradientTransform="matrix(1.02926 0 0 1.02926 -160.32 295.636)"
				x1={215.079}
				y1={-184.757}
				x2={300.817}
				y2={-184.757}
			/>
			<linearGradient id="c">
				<stop
					style={{
						stopColor: '#ff392f',
						stopOpacity: 1,
					}}
					offset={0}
				/>
				<stop
					style={{
						stopColor: '#8f25ff',
						stopOpacity: 1,
					}}
					offset={1}
				/>
			</linearGradient>
		</defs>
		<path
			style={{
				fill: 'url(#d)',
				fillOpacity: 1,
				stroke: 'none',
				strokeWidth: '.80169px',
				strokeLinecap: 'butt',
				strokeLinejoin: 'miter',
				strokeOpacity: 1,
			}}
			d="M17.68 103.769c-.001 48.484 39.304 88.237 87.788 88.236 48.485 0 87.79-39.304 87.79-87.789 0-2.564-.122-5.1-.337-7.608l.081-.426h-.11c-.003-.022-.003-.045-.004-.067l-3.681.067h-41.722l-5.316 21.973 25.635-.044c-6.26 28.893-31.959 50.543-62.726 50.543-35.454 0-64.195-29.189-64.195-64.643m.005.095c.43-35.085 29.004-63.84 64.19-63.84 23.86 0 44.68 13.016 55.745 32.335l21.585-10.691c-14.94-27.113-43.794-45.482-76.94-45.481-48.19 0-87.31 39.275-87.784 87.353"
		/>
		<path
			style={{
				fill: 'url(#e)',
				fillOpacity: 1,
				stroke: 'none',
				strokeWidth: '.80169px',
				strokeLinecap: 'butt',
				strokeLinejoin: 'miter',
				strokeOpacity: 1,
			}}
			d="M17.694 103.772c0 48.484 39.305 88.237 87.79 88.236 48.484 0 87.789-39.304 87.788-87.789 0-2.564-.12-5.1-.336-7.607l.081-.427h-.11c-.003-.022-.003-.044-.004-.066l-3.681.066H147.5l-5.316 21.973 25.635-.044c-6.26 28.894-31.959 50.543-62.726 50.543-35.454 0-64.195-29.188-64.195-64.642"
		/>
		<circle
			style={{
				fill: 'url(#f)',
				fillOpacity: 1,
				fillRule: 'evenodd',
				strokeWidth: 0.771943,
			}}
			cx={105.175}
			cy={105.473}
			r={44.123}
		/>
		<circle
			style={{
				fill: '#1e4aff',
				fillOpacity: 1,
				fillRule: 'evenodd',
				strokeWidth: 0.932076,
			}}
			cx={163.551}
			cy={52.76}
			r={20.695}
		/>
	</svg>
)

export default SvgComponent
