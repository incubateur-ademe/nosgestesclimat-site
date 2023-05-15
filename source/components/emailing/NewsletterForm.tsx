import { LOCAL_STORAGE_KEY } from '@/storage/persistSimulation'
import safeLocalStorage from '@/storage/safeLocalStorage'
import LZString from 'lz-string'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
export const NewsletterForm = () => {
	const [isSent, setIsSent] = useState(false)
	const [compressedSimulation, setCompressedSimulation] = useState<
		string | undefined
	>(undefined)
	const { t } = useTranslation()

	const handleSubmit = (e) => {
		e.preventDefault()

		const form: HTMLFormElement = e.target
		// Send using XHR
		const data = new FormData(form)

		const xhr = new XMLHttpRequest()
		xhr.open(form.method, form.action)
		xhr.setRequestHeader('Accept', 'application/xxx-form-urlencoded')
		xhr.onreadystatechange = () => {
			console.log(xhr)
			if (xhr.readyState !== XMLHttpRequest.DONE) return
			if (xhr.status === 200 || xhr.readyState === XMLHttpRequest.DONE) {
				form.reset()
				setIsSent(true)
			} else {
				console.log('Error')
			}
		}
		xhr.send(data)
	}

	useEffect(() => {
		const serializedUser = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)

		if (serializedUser == null || compressedSimulation) return

		const deserializedUser = serializedUser
			? JSON.parse(serializedUser)
			: {
					simulations: [],
			  }

		if (!deserializedUser.simulations.length) return

		const simulation = deserializedUser?.simulations?.[0]

		const compressed = LZString.compressToUTF16(
			JSON.stringify({
				currentSimulationId: simulation.id,
				simulations: [simulation],
			}) || ''
		)

		setCompressedSimulation(compressed)
	}, [compressedSimulation])

	return (
		<div
			className="sib-form"
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
			<script
				defer
				src="https://sibforms.com/forms/end-form/build/main.js"
			></script>
			<div id="sib-form-container" className="sib-form-container">
				<div
					id="sib-container"
					className="sib-container--large sib-container--vertical"
					css="text-align:center; max-width:540px; margin: 0 auto;"
				>
					{isSent ? (
						<div css="padding: 8px 0;">
							<div
								className="sib-form-block"
								css="font-size:1.5rem; text-align:left; font-weight:700; color:#3C4858; background-color:transparent; text-align:left"
							>
								<p>Merci pour votre inscription ! 🌱</p>
							</div>
							<p
								css={`
									text-align: left;
								`}
							>
								Vous allez recevoir un email de notre part sous peu.
							</p>
						</div>
					) : (
						<form
							id="sib-form"
							method="POST"
							action="https://981c5932.sibforms.com/serve/MUIEAK-yyOUncCUxLV98mPvpgnvUYXKvfRdgb2m0g3ShYDdMN_zkTc0S9opPolKEeYzyaL2kY6Qe_AzmYpVIo8wCeVKjOAM-VgJT1QzaQfs8bjw4cIK3CJvipxNbDXa1thV9p9aRPo07mcePw-h4XYZFTjcrlE-ngNI5gO9RV-83N_jJZ37pekm7SpDW4_GqGf1hA5ZVGgeXRlmd"
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
								<div
									className="sib-form-block"
									css="font-size:1.25rem; text-align:left; font-weight:700; color:#3C4858; background-color:transparent; text-align:left"
								>
									<p>Bravo pour ce premier pas ! 👏</p>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div
									className="sib-form-block"
									css="font-size:16px; text-align:left; color:#3C4858; background-color:transparent; text-align:left"
								>
									<div className="sib-text-form-block">
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
								<div className="sib-input sib-form-block">
									<div className="form__entry entry_block">
										<div className="form__label-row ">
											<label
												className="entry__label"
												css="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; color:#3c4858;"
												data-required="*"
												htmlFor="EMAIL"
											>
												Entrez votre adresse email
											</label>

											<div className="entry__field">
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

										<label
											className="entry__error entry__error--primary"
											css="font-size:16px; text-align:left; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;"
										></label>
									</div>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div className="sib-optin sib-form-block">
									<div className="form__entry entry_mcq">
										<div className="form__label-row ">
											<div className="entry__choice">
												<label css="display: flex; gap: 0.15rem; align-items: flex-start;">
													<input
														type="checkbox"
														className="input_replaced"
														value="1"
														id="OPT_IN"
														name="OPT_IN"
														required
													/>
													<span
														className="checkbox checkbox_tick_positive"
														css="margin-left:"
													></span>
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
										<label
											className="entry__specification"
											css="font-size:12px; color:#8390A4; line-height: 1rem; display: flex; justify-content: flex-start; align-items: flex-start; text-align: left;"
										>
											Vous pourrez choisir de ne plus recevoir nos emails à tout
											moment
										</label>
									</div>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div className="sib-form-block" css="text-align: left">
									<button
										className="sib-form-block__button sib-form-block__button-with-loader  ui__ button plain small"
										form="sib-form"
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
							<input
								type="hidden"
								name="DOMAINE"
								id="DOMAINE"
								value={
									compressedSimulation
										? `http://localhost:8080?sc=${compressedSimulation}`
										: ''
								}
							/>
							<input
								type="hidden"
								name="PROFESSION"
								id="PROFESSION"
								value={location
									.toString()
									.replace('/simulateur/fin', '/mon-empreinte-carbone/partage')}
							/>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}
