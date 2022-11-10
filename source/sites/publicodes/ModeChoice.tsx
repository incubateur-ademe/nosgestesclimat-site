import IllustratedButton from 'Components/IllustratedButton'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setActionMode } from '../../actions/actions'

export default ({}) => {
	const dispatch = useDispatch()

	return (
		<div
			css={`
				> div {
					margin: 4rem 1rem;
				}
			`}
		>
			<div>
				<h1>
					<Trans>Passer à l'action</Trans>
				</h1>
				<p>
					<Trans>Votre mission : réduire votre empreinte.</Trans>
				</p>
				<p>
					<Trans>Comment voulez-vous procéder ?</Trans>
				</p>
			</div>
			<div>
				<IllustratedButton
					icon="🐣"
					to="/actions"
					onClick={() => dispatch(setActionMode('guidé'))}
				>
					<div>
						<div>
							<Trans>Guidé</Trans>
						</div>
						<p>
							<small>
								<Trans>
									On vous propose une sélection graduelle de gestes.
								</Trans>
							</small>
						</p>
					</div>
				</IllustratedButton>
				<IllustratedButton
					to="/actions"
					icon="🐓"
					onClick={() => dispatch(setActionMode('autonome'))}
				>
					<div>
						<div>
							<Trans>Autonome</Trans>
						</div>
						<p>
							<small>
								<Trans>A vous de choisir vos gestes à la carte.</Trans>
							</small>
						</p>
					</div>
				</IllustratedButton>
			</div>
		</div>
	)
}
