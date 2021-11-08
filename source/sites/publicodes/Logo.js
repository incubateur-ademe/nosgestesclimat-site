// Created with Inkscape (http://www.inkscape.org/)

export default ({ withText = true }) => (
	<div css="display: flex; margin: .4rem ; align-items: center">
		<svg
			viewBox="0 0 210 210"
			version="1.1"
			id="svg20794"
			width="100px"
			css="width: 3.5rem"
		>
			<defs id="defs20791" />
			<g id="layer1">
				<g
					id="g12764"
					transform="matrix(3.2687351,0,0,3.2687351,-975.59786,-744.64683)"
				>
					<rect
						css="fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#532fc5;stroke-width:3;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
						id="rect846-5-2-2"
						width="59.360001"
						height="59.360325"
						x="301.05234"
						y="230.32544"
					/>
					<path
						css="fill:#532fc5;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
						d="m 301.7089,259.18322 c 6.66355,-10.78996 13.07193,-23.45851 20.1518,-23.45851 10.60493,0 7.75671,35.67638 17.59501,49.03228 2.36318,3.2081 7.51272,3.89799 19.44672,3.50567 0,2.05152 -41.65332,1.17582 -57.93717,1.17582 z"
						id="path2165"
					/>
				</g>
			</g>
		</svg>
		{withText && <Name />}
	</div>
)

const Name = ({}) => (
	<span
		css={`
			display: flex;
			flex-direction: column;
			font-weight: bold;
			color: var(--color);
			font-size: 75%;
			line-height: 1.1rem;
			margin-left: 0.4rem;
		`}
	>
		<span>Nos</span>
		<span>Gestes</span>
		<span>Climat</span>
	</span>
)
