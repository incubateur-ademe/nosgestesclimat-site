import CO2e from 'Images/co2e.svg'
import { Trans } from 'react-i18next'

export default () => (
	<>
		<h1>
			<Trans>On la mesure comment ?</Trans>
		</h1>
		<p>
			<Trans i18nKey={`publicodes.Tutorial.slide2.p1`}>
				Avec une unité au nom barbare : l'équivalent CO₂. Le dioxyde de carbone
				<img
					alt=""
					src="/images/co2.svg"
					css={`
						object-fit: cover;
						vertical-align: middle;
						width: 3.5rem;
						height: 1.7rem;
					`}
				/>
				, vous le connaissez : on l'expire toute la journée, mais sans influence
				sur le climat.
			</Trans>
		</p>
		<div
			aria-hidden="true"
			css={`
				svg {
					height: 7rem;
					margin: 0.6rem auto;
					display: block;
					animation: fall 0.5s ease-in;
				}

				@keyframes fall {
					from {
						transform: translateY(-100%);
						opacity: 0;
					}
					80% {
						transform: translateY(10%);
						opacity: 1;
					}
					100% {
						transform: translateY(0%);
						opacity: 1;
					}
				}

				svg text {
					mask-size: 200%;

					mask-image: linear-gradient(
						-75deg,
						rgba(0, 0, 0, 0.6) 30%,
						#000 50%,
						rgba(0, 0, 0, 0.6) 70%
					);
					mask-size: 200%;
					animation: shine 2s linear infinite;

					@keyframes shine {
						from {
							-webkit-mask-position: 150%;
						}
						to {
							-webkit-mask-position: -50%;
						}
					}
				}
			`}
		>
			<CO2e />
		</div>
		<p>
			<Trans i18nKey={`publicodes.Tutorial.slide2.p2`}>
				Ce sont les machines qui font notre confort moderne qui en rejettent
				massivement, à tel point qu'on le compte en milliers de kilos par an et
				par personne, donc en <strong>tonnes</strong> de CO₂e !
			</Trans>
		</p>
		<blockquote>
			<details>
				<summary>
					<Trans i18nKey={'sites.publicodes.Tutorial.questionE'}>
						💡 Mais que veut dire ce petit <em>e</em> ?
					</Trans>
				</summary>{' '}
				<Trans i18nKey={`publicodes.Tutorial.slide2.blockquote`}>
					D'autres gaz, surtout le méthane{' '}
					<img
						alt=""
						src="/images/methane.svg"
						css="width: 1.8rem; vertical-align: middle; object-fit: cover; height: 1.7rem"
					/>{' '}
					et le protoxyde d'azote{' '}
					<img
						alt=""
						src="/images/n2o.svg"
						css="width: 3rem; vertical-align: middle; object-fit: cover; height: 1.7rem"
					/>{' '}
					réchauffent aussi la planète : on convertit leur potentiel de
					réchauffement en équivalent CO₂ pour simplifier la mesure.{' '}
				</Trans>
			</details>
		</blockquote>
	</>
)
