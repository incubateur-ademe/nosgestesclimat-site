import ObjectifClimat from 'Images/objectif-climat.svg'
import { Trans } from 'react-i18next'

export default () => (
	<>
		<Trans i18nKey={'publicodes.Tutorial.slide5.p1'}>
			<h1>Et l'objectif ?</h1>
			<p>Nous devons diminuer notre empreinte climat au plus vite.</p>
			<p>
				En France, ça consiste à passer de ~10 tonnes à{' '}
				<strong>moins de 2 tonnes</strong> par an.
			</p>
		</Trans>

		<ObjectifClimat
			aria-hidden="true"
			css={`
				width: 16rem;
				g path:first-child {
					stroke-dasharray: 1000;
					stroke-dashoffset: 1000;
					animation: dash 5s ease-in forwards;
					animation-delay: 1s;
				}

				@keyframes dash {
					to {
						stroke-dashoffset: 0;
					}
				}
				g path:nth-child(2) {
					animation: objective-line-appear 2s ease-in;
				}
				@keyframes objective-line-appear {
					from {
						opacity: 0;
					}
					30% {
						opacity: 0;
					}
					100% {
						opacity: 1;
					}
				}
				path[fill='#532fc5'] {
					fill: var(--color);
				}
			`}
		/>
		<p css="text-align: center; line-height: 1.2rem; max-width: 18rem; margin: 0 auto">
			<em>
				<Trans>Pour en savoir plus, tout est expliqué dans </Trans>
				<a href="https://nosgestesclimat.fr/blog/budget">
					<Trans>cet article</Trans>
				</a>{' '}
				<Trans>(15 min de lecture)</Trans>
			</em>
			.
		</p>
	</>
)
