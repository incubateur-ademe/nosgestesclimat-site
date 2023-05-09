import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const NewsletterForm = () => {
	const [isSent, setIsSent] = useState(false)
	const { t } = useTranslation()
	return (
		<div
			className="sib-form"
			css="text-align: center; background-color: #EFF2F7;"
		>
			<div id="sib-form-container" className="sib-form-container">
				<div
					id="sib-container"
					className="sib-container--large sib-container--vertical"
					css="text-align:center; background-color:rgba(255,255,255,1); max-width:540px;"
				>
					{isSent ? (
						<div css="padding: 8px 0;">
							<div
								className="sib-form-block"
								css="font-size:1.5rem; text-align:left; font-weight:700; color:#3C4858; background-color:transparent; text-align:left"
							>
								<p>Merci pour votre inscription ! 🌱</p>
							</div>
						</div>
					) : (
						<form
							id="sib-form"
							method="POST"
							action="https://981c5932.sibforms.com/serve/MUIEAH6i1hwhtR1Y1WcOutihCWAQVEa0QIOn2mMXLQP0ZC7d6Y9Z8lkoSyaU-k_eupBP-AenZNOzVPxd0kml98KM7ABJ5fXBVZTYbUm3uU5o7B7NSdjYuxgrp67XfEpF4RHzw09w2WxFrpSN-4LELhtfmq-d4rh_93fbMl-x9uIl0A5_eFYIhTvZBqITf6r4ZsnGD8M-8217QWpf"
							onSubmit={() => setIsSent(true)}
						>
							<div css="padding: 8px 0;">
								<div
									className="sib-form-block"
									css="font-size:1.5rem; text-align:left; font-weight:700; color:#3C4858; background-color:transparent; text-align:left"
								>
									<p>Bravo pour ce premier pas ! 🌱</p>
								</div>
							</div>
							<div css="padding: 8px 0;">
								<div
									className="sib-form-block"
									css="font-size:16px; text-align:left; color:#3C4858; background-color:transparent; text-align:left"
								>
									<div className="sib-text-form-block">
										<p>
											<br />
										</p>
										<p>
											Pour continuer sur votre lancée, laissez-nous votre email
											pour recevoir votre résultat et des conseils pour réduire
											votre empreinte carbone (1 fois par mois max.).
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
												for="EMAIL"
												data-required="*"
											>
												Entrez votre adresse email
											</label>

											<div className="entry__field">
												<input
													className="input ui__ field"
													type="text"
													id="EMAIL"
													name="EMAIL"
													autocomplete="off"
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
											<div className="entry__choice" css="">
												<label css="display: flex; gap: 0.15rem; align-items: flex-start;">
													<input
														type="checkbox"
														className="input_replaced"
														value="1"
														id="OPT_IN"
														name="OPT_IN"
													/>
													<span
														className="checkbox checkbox_tick_positive"
														css="margin-left:"
													></span>
													<span css="font-size:14px; text-align:left; color:#3C4858; background-color:transparent;">
														<p>
															J'accepte de recevoir des informations de la part
															de Nos Gestes Climat et notre{' '}
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
											css="font-size:12px; text-align:left; color:#8390A4; text-align:left"
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
										className="sib-form-block__button sib-form-block__button-with-loader"
										css="font-size:16px; text-align:left; font-weight:700; color:#FFFFFF; background-color:#3E4857; border-radius:3px; border-width:0px;"
										form="sib-form"
										type="submit"
									>
										<svg
											className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon"
											viewBox="0 0 512 512"
										>
											<path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
										</svg>
										Envoyer
									</button>
								</div>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}
