import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Meta from '../../components/utils/Meta'
import { useQuery } from '../../utils'
import { createIssue, formStyle } from './Contact'

export default ({}) => {
	const fromLocation = useQuery().get('fromLocation')

	const [sujet, setSujet] = useState('')
	const [comment, setComment] = useState('')
	const [URL, setURL] = useState(null)
	const [buttonDisabled, disableButton] = useState(false)

	const { i18n } = useTranslation()
	const { t } = useTranslation()

	return (
		<div className="ui__ container" css="padding-bottom: 1rem">
			<Meta
				title={t('Contribuer')}
				description={t('meta.publicodes.Contribution.description')}
			></Meta>
			<h1>
				<Trans>Un problème de traduction ?</Trans>
			</h1>
			<p>
				<Trans i18nKey={'publicodes.Contribution.traductionIntro'}>
					Nos Gestes Climat vient tout juste d'être traduit dans plusieurs
					langues. N'hésitez pas à vous faire part de vos doutes quand à un
					problèm de traduction sur le site 😊. Nous le prendrons en compte
					rapidement.
				</Trans>
			</p>
			<h2>
				<Trans>Vous avez du temps pour nous aider à traduire</Trans>
			</h2>
			<p>
				<Trans i18nKey={'publicodes.Contribution.translationWikiInvite'}>
					Suivez notre guide complet pour contribuer directement à la traduction
					du site :{' '}
					<a href="https://github.com/datagir/nosgestesclimat-site/wiki/Translation#improving-an-existing-translation">
						rendez-vous sur notre wiki
					</a>
					.
				</Trans>
			</p>
			<h2>
				<Trans>Vous avez juste 30 secondes pour nous aider</Trans>
			</h2>
			<div className="ui__ card" css="padding: 1rem 0">
				{!URL ? (
					<form css={formStyle}>
						<label css="color: var(--color)">
							<Trans>Le titre bref de votre problème</Trans>
							<input
								aria-describedby="messageAttention"
								value={sujet}
								onChange={(e) => setSujet(e.target.value)}
								type="text"
								name="sujet"
								placeholder={t('Problème de traduction')}
								required
							/>
						</label>
						<label css="color: var(--color)">
							<Trans
								i18nKey={
									'publicodes.Contribution.descriptionComplèteTraduction'
								}
							>
								<p>La description complète de votre problème</p>
							</Trans>
							<textarea
								aria-describedby="messageAttention"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								name="comment"
								required
							/>
						</label>
						<p id="messageAttention">
							<em>
								<Trans>
									Cette contribution sera publique : n'y mettez pas
									d'informations sensibles
								</Trans>
							</em>
						</p>
						<button
							className="ui__ button"
							type="submit"
							disabled={buttonDisabled}
							onClick={(e) => {
								if (buttonDisabled) return null

								e.preventDefault()
								disableButton(true)
								const augmentedComment =
									comment +
									t('publicodes.TranslationContribution.commentaireAugmenté', {
										fromLocation,
									})
								createIssue(sujet, augmentedComment, setURL, disableButton, [
									'i18n',
									'contribution externe',
								])
							}}
						>
							<Trans>Envoyer</Trans>
						</button>
					</form>
				) : (
					<p role="status">
						<Trans i18nKey={'publicodes.TranslationContribution.remerciements'}>
							Merci 😍! Suivez l'avancement de votre suggestion en cliquant sur{' '}
							<a href={URL}>ce lien</a>.
						</Trans>
					</p>
				)}
			</div>
		</div>
	)
}
