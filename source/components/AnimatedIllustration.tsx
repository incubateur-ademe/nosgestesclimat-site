import IllustrationSVG from './IllustrationSVG.tsx'
export default ({ small }) => (
	<div
		css={`
			svg {
				max-width: ${small ? '15rem' : '30rem'};
				height: auto;
				margin: 1rem auto;
				border-radius: 0.8rem;
				width: 95%;
			}
			.prefix__avion {
				animation: traversée 90s infinite;
				animation-timing-function: linear;
			}
			@keyframes traversée {
				from {
					transform: translateX(0%);
				}
				to {
					transform: translateX(100%);
				}
			}
			.prefix__fenetres rect:nth-child(3) {
				animation: jour-nuit 60s infinite;
				animation-timing-function: steps(5, end);
			}
			.prefix__fenetres rect:nth-child(5) {
				animation: jour-nuit 60s infinite;
				animation-timing-function: steps(5, end);
			}
			@keyframes jour-nuit {
				0% {
					opacity: 0;
				}
				20% {
					opacity: 1;
				}
				40% {
					opacity: 0;
				}
				60% {
					opacity: 1;
				}
				80% {
					opacity: 0;
				}
				100% {
					opacity: 1;
				}
			}
			.prefix__cycliste {
				animation: saute 1s infinite;
				animation-timing-function: linear;
				animation: traversée-inversée 45s infinite;
			}
			.prefix__velo {
				animation: traversée-inversée 45s infinite;
			}
			@keyframes saute {
				from {
					transform: translateY(0%);
				}
				to {
					transform: translateY(0.5%);
				}
			}
			@keyframes traversée-inversée {
				from {
					transform: translateX(0%);
				}
				to {
					transform: translateX(-100%);
				}
			}
		`}
	>
		<IllustrationSVG />
	</div>
)
