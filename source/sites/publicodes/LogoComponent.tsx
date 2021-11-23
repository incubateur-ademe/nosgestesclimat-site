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

			:hover path:nth-child(2) {
				animation: reveal 4s linear forwards;
			}
			:hover path:first-child {
				fill: '#d6a405';
			}
			@keyframes golden {
				0% {
					fill: 'red';
				}
				100% {
					fill: '#d6a405';
				}
			}

			@keyframes reveal {
				0% {
					transform: translateX(150%);
					fill: white;
				}
				20% {
					transform: translateX(0);
					fill: white;
				}
				30% {
					transform: translateX(0);
					fill: white;
				}
				100% {
					transform: translateX(150%);
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
