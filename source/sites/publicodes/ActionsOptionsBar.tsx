import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import emoji from '../../components/emoji'
import ActionsChosenIndicator from './ActionsChosenIndicator'

export default ({ finalActions, setRadical, radical }) => {
	const [visible, setVisible] = useState(false)
	const { t } = useTranslation()
	const numberOfAvailableFinalActions = finalActions.length

	if (!visible) {
		return (
			<div
				css={`
					text-align: right;
					right: 0;
					button {
						font-size: 100%;
						padding: 0 !important;
						margin-right: 0.25rem;
					}
					height: 2rem;
				`}
			>
				<button
					title={t('Ouvrir les options de tri')}
					onClick={() => setVisible(true)}
				>
					{emoji('⚙️')}
				</button>
			</div>
		)
	}
	return (
		<div
			css={`
				display: block;
				text-align: center;
				height: 2rem;
			`}
		>
			<small role="status">
				<Trans i18nKey="publicodes.ActionsOptionsBar.actionsRecap">
					{{ numberOfAvailableFinalActions }} actions disponibles,
				</Trans>{' '}
				<ActionsChosenIndicator />
			</small>{' '}
			<small css="@media(max-width: 800px){display: none}">
				<Trans>Triées par :</Trans>
			</small>{' '}
			<small css="@media(min-width: 800px){display: none}">
				<Trans>Tri :</Trans>
			</small>{' '}
			<button
				onClick={() => setRadical(!radical)}
				className="ui__ dashed-button"
				css={`
					color: var(--lighterTextColor);
					font-size: 85% !important;
				`}
				title={t('Choisir le type de tri des actions')}
			>
				{radical ? (
					<span>
						<Trans>le + d'impact climat</Trans>
					</span>
				) : (
					<span>
						<Trans>le - d'impact climat</Trans>
					</span>
				)}
				.
			</button>
			<button
				title={t('Fermer les options de tri')}
				onClick={() => setVisible(false)}
				css={`
					padding: 0;
					padding-left: 1rem;
					margin-right: 0.25rem;
				`}
			>
				{emoji('❌')}
			</button>
		</div>
	)
}
