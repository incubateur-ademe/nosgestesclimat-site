import { useState } from 'react'
import IllustrationSVG from './IllustrationSVG.tsx'
export default ({ small }) => {
	const [cycling, pleaseCycle] = useState(false)
	return (
		<div
			css={`
				svg {
					max-width: ${small ? '15rem' : '32rem'};
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
				${cycling &&
				`
			.prefix__cycliste {
				animation: traversée-inversée 45s infinite; /*, saute linear 1s infinite; Pas possible de combiner les deux, à cause du transform:*/
			}
				.prefix__velo {
					animation: traversée-inversée 45s infinite;
				}
				@keyframes saute {
					from {
						transform: translateY(0%);
					}
					to {
						transform: translateY(5%);
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
			`}
		>
			<IllustrationSVG />
		</div>
	)
}
