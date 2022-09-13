import ShareButton from 'Components/ShareButton'
import { useEngine } from 'Components/utils/EngineContext'
import Meta from 'Components/utils/Meta'
import { motion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { correctValue } from '../../../components/publicodesUtils'
import NeutralH1 from '../../../components/ui/NeutralH1'
import { ActionButton } from './Buttons'
import { DocumentationEndButton, generateImageLink } from './index'

const petrolRuleName = 'pétrole . pétrole brut'

export default ({ headlessMode }) => {
	const shareImage = generateImageLink(window.location)
	//
	//	Configuration is try and test, feeling, really
	const valueSpring = useSpring(0, {
		mass: 1,
		stiffness: 10,
		damping: 10,
	})

	const [value, setValue] = useState(0)

	const engine = useEngine()
	const petroleBrut = correctValue(engine.evaluate(petrolRuleName))
	const pleinVolume = correctValue(engine.evaluate('pétrole . volume plein'))

	const score = petroleBrut,
		secondaryValue = Math.round(value),
		primaryValue = Math.round(value / pleinVolume)

	useEffect(() => {
		const unsubscribe = valueSpring.onChange((v) => {
			setValue(v)
		})

		headlessMode ? setValue(score) : valueSpring.set(score)

		return () => unsubscribe()
	}, [])
	const gradientPosition = Math.round((1 - value / score) * 400 + 50)

	const { t } = useTranslation()

	return (
		<div>
			<Meta
				title={t('Mon empreinte climat')}
				description={t(`meta.publicodes.fin.Petrogaz.description`, {
					empreinte: primaryValue,
				})}
				image={shareImage}
				url={window.location}
			/>
			<motion.div
				animate={{ scale: [0.9, 1] }}
				transition={{ duration: headlessMode ? 0 : 0.6 }}
				className=""
				id="fin"
				css={`
					background: var(--darkColor);
					background: linear-gradient(
						180deg,
						var(--darkColor) 0%,
						var(--darkerColor) ${gradientPosition}%
					);
					color: white;
					margin: 0 auto;
					border-radius: 0.6rem;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
					small,
					small a {
						color: var(--lightColor2);
					}
				`}
			>
				<div id="shareImage" css="padding: 2rem 0 0">
					<div css="display: flex; align-items: center; justify-content: center">
						<img
							src="/images/pompe-essence.svg"
							css="height: 10rem; margin-right: .4rem"
							alt={t('Icône représentant une pompe à pétrole')}
						/>
						<div
							css={`
								flex-direction: column;
								display: flex;
								justify-content: space-evenly;
								height: 10rem;
								width: 16rem;
							`}
						>
							<div css="font-weight: bold; font-size: 280%;">
								<span css="width: auto; text-align: right; display: inline-block">
									{primaryValue}
								</span>{' '}
								<Trans>pleins</Trans>
							</div>
							<span>
								<Trans>
									de <NeutralH1>pétrole brut par an</NeutralH1>.
								</Trans>
							</span>
							<small>
								<Trans i18nKey={`publicodes.fin.Petrogaz.litres`}>
									Soit {{ secondaryValue }} litres (plein de {{ pleinVolume }}{' '}
									litres).
								</Trans>
							</small>
						</div>
					</div>
					<div css="padding: 1rem; max-width: 30rem; margin: 0 auto; font-size: 90%">
						<Trans i18nKey={`publicodes.fin.Petrogaz.explications`}>
							<p>
								C'est une estimation <em>a minima</em> de votre consommation de
								pétrole brut à l'année.
							</p>

							<p>
								Estimée via vos trajets en voiture, en avion, en bus,
								consommation de fioul pour chauffage, elle ne prend pas (encore)
								en compte le pétrole utilisé pour acheminer vos achats, et
								l'énergie grise de vos diverses possessions.
							</p>
						</Trans>
					</div>
				</div>
				<ActionButton
					text={t('Réduire ma conso')}
					imgSrc="/images/1F1FA-1F1E6.svg"
					invertImage={false}
					url={'/actions?métrique=pétrole'}
				/>
				<div css="display: flex; flex-direction: column; margin: 1rem 0">
					<ShareButton
						text={t('Voilà mon empreinte ⛽️ pétrole. Mesure la tienne !')}
						url={window.location}
						title={'Nos Gestes Climat'}
						color="white"
						label={t('Partager mes résultats')}
					/>
				</div>
				<DocumentationEndButton ruleName={petrolRuleName} />
			</motion.div>
		</div>
	)
}
