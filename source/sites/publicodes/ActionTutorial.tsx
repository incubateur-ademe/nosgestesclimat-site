import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { actionImg } from '../../components/SessionBar'
import { skipTutorial } from '../../actions/actions'
import { Trans } from 'react-i18next'

export default ({ value, unit }) => {
	const dispatch = useDispatch()
	return (
		<div className="ui__ card light colored content" css="margin-top: 1.6rem">
			<h1 css="display: flex; align-items: center">
				<img src={actionImg} css="width: 2rem" />
				<Trans>Passer à l'action !</Trans>
			</h1>
			<p>
				<Trans i18nKey={'publicodes.ActionTutorial.félicitation'}>
					Vous avez terminé votre simulation, {emoji('👏')} bravo !
				</Trans>
			</p>
			<p>
				<Trans i18nKey={'publicodes.ActionTutorial.msgEstimation'}>
					Vous connaissez maintenant votre empreinte, estimée à {{ value }}{' '}
					{{ unit }}, et vous avez sûrement déjà des idées pour la réduire...
				</Trans>
			</p>
			<p>
				<Trans i18nKey={'publicodes.ActionTutorial.msgPrésentation'}>
					Pour vous aider, nous vous présenterons{' '}
					<strong>une liste d'actions</strong> :
				</Trans>
			</p>

			<ul css="li {list-style-type: none;}">
				<li>
					{emoji('✅')} <Trans>sélectionnez celles qui vous intéressent</Trans>
				</li>
				<li>
					{' '}
					{emoji('❌')}{' '}
					<Trans>
						écartez celles qui vous semblent trop ambitieuses ou déplacées.
					</Trans>
				</li>
			</ul>
			<p>
				{emoji('💡')}{' '}
				<Trans i18nKey={'publicodes.ActionTutorial.msgPrécision'}>
					Pour améliorer la précision, certaines actions vous poseront quelques
					questions en plus.
				</Trans>
			</p>
			<button
				className="ui__ button plain cta"
				onClick={() => dispatch(skipTutorial('actions'))}
			>
				<Trans>Démarrer</Trans>
			</button>
		</div>
	)
}
