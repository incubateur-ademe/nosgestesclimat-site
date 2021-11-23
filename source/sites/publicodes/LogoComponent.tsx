// Created with Inkscape (http://www.inkscape.org/)
import Logo from 'Images/Logo'

export default ({ withText = true }) => (
	<div
		css={`
			display: flex;
			margin: 0.4rem;
			align-items: center;
			height: 3.5rem;
			svg {
				width: 3.5rem;
				height: 3.5rem;
			}

			:hover path {
				stroke-dasharray: 1000;
				stroke-dashoffset: 1000;
				animation: dash 5s ease-in-out forwards;
			}

			@keyframes dash {
				to {
					stroke-dashoffset: 0;
				}
			}
		`}
	>
		<Logo />
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
