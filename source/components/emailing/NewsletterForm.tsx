import { NETLIFY_FUNCTIONS_URL } from '@/constants/urls'
import { currentSimulationSelector } from '@/selectors/storageSelectors'
import { encryptedSimulationURL } from '@/sites/publicodes/conference/useDatabase'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

const appURL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:8080'
		: 'https://nosgestesclimat.fr'

export const NewsletterForm = () => {
	const [isSent, setIsSent] = useState(false)

	const { t } = useTranslation()

	const currentSimulation = useSelector(currentSimulationSelector)

	const saveSimulationInDB = async (encryptedData) => {
		try {
			const response = await fetch(encryptedSimulationURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: uuid(),
					data: encryptedData,
				}),
			})

			const simulationSaved = await response.json()
			return simulationSaved.id
		} catch (e) {
			console.log(e)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			if (!currentSimulation) return

			// Encrypt simulation data
			const encryptedSimulation = await fetch(
				`${NETLIFY_FUNCTIONS_URL}/encrypt-data`,
				{
					method: 'POST',
					body: JSON.stringify({
						...currentSimulation,
					}),
				}
			)

			// Save simulation in DB
			const idEncryptedSimulationSaved =
				(await saveSimulationInDB(encryptedSimulation)) || {}
			const form: HTMLFormElement = e.target

			const data = new FormData(form)

			await fetch(`${NETLIFY_FUNCTIONS_URL}/email-service`, {
				method: 'POST',
				body: JSON.stringify({
					email: data.get('EMAIL'),
					optIn: data.get('OPT_IN'),
					simulationURL: `${appURL}?sid=${idEncryptedSimulationSaved}`,
					shareURL: location
						.toString()
						.replace('/simulateur/fin', '/mon-empreinte-carbone/partage'),
				}),
			})
			setIsSent(true)
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div
			css={`
				text-align: center;
				border-radius: 0.5rem;
				width: 35rem;
				max-width: 100%;
				margin: 0 auto;
				margin-top: 2rem;
				position: relative;
			`}
		>
			<div>
				<div css="text-align:center; max-width:540px; margin: 0 auto;">
					{isSent ? (
						<div css="padding: 8px 0;">
							<div css="font-size:1.5rem; text-align:left; font-weight:700; color:#3C4858; background-color:transparent; text-align:left">
								<p>Merci pour votre inscription ! 🌱</p>
							</div>
							<p
								css={`
									text-align: left;
									margin-top: 1rem;
								`}
							>
								Vous allez recevoir un email de notre part sous peu.
							</p>
						</div>
					) : (
						<form
							id="newsletter-form"
							onSubmit={handleSubmit}
							css={`
								margin: 0 auto;
								box-sizing: border-box;
								position: relative;
								padding-top: 1rem;
							`}
						>
							<div
								css={`
									position: absolute;
									top: 0;
									left: 0;
									width: 3rem;
									height: 3px;
									background-color: #00a4ac;
								`}
							></div>
							<div css="padding: 8px 0;">
								<div css="font-size:1.25rem; text-align:left; font-weight:700; color:#3C4858; background-color:transparent; text-align:left">
									<p>Bravo pour ce premier pas ! 👏</p>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div css="font-size:16px; text-align:left; color:#3C4858; background-color:transparent; text-align:left">
									<div>
										<p>Vous souhaitez continuer sur votre lancée ?</p>
										<p>
											Laissez-nous votre email pour recevoir{' '}
											<strong>votre résultat</strong> et{' '}
											<strong>des conseils</strong> pour réduire votre empreinte
											carbone (1 fois par mois max.).
										</p>
									</div>
								</div>
							</div>
							<div css="padding: 8px 0; text-align: left;">
								<div>
									<div>
										<div>
											<label
												css="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; color:#3c4858;"
												data-required="*"
												htmlFor="EMAIL"
											>
												Entrez votre adresse email
											</label>

											<div>
												<input
													className="input ui__ field"
													type="text"
													id="EMAIL"
													name="EMAIL"
													placeholder="Email"
													data-required="true"
													required
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div>
									<div>
										<div>
											<div>
												<label css="display: flex; gap: 0.15rem; align-items: flex-start;">
													<input
														type="checkbox"
														value="1"
														id="OPT_IN"
														name="OPT_IN"
														required
													/>
													<span css="margin-left:"></span>
													<span css="font-size:14px; text-align:left; color:#3C4858; background-color:transparent;">
														<p>
															J'accepte de recevoir des informations de la part
															de Nos Gestes Climat et sa{' '}
															<a
																target="_blank"
																href="https://nosgestesclimat.fr/vie-privée"
																aria-label={t(
																	'politique de confidentialité, nouvelle fenêtre'
																)}
															>
																politique de confidentialité
															</a>
														</p>
													</span>{' '}
												</label>
											</div>
										</div>
										<p css="font-size:12px; color:#8390A4; line-height: 1rem; display: flex; justify-content: flex-start; align-items: flex-start; text-align: left;">
											Vous pourrez choisir de ne plus recevoir nos emails à tout
											moment
										</p>
									</div>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div css="text-align: left">
									<button
										className="ui__ button plain small"
										form="newsletter-form"
										type="submit"
									>
										Envoyer
									</button>
								</div>
							</div>
							<input
								type="text"
								name="email_address_check"
								value=""
								css={`
									visibility: hidden;
								`}
							/>
							<input type="hidden" name="locale" value="en" />
							<input type="hidden" name="html_type" value="simple" />
						</form>
					)}
				</div>
			</div>
		</div>
	)
}
