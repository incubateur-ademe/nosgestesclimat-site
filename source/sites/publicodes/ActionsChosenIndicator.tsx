import animate from 'Components/ui/animate'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export default ({}) => {
	const { t } = useTranslation()
	const actionChoices = useSelector((state) => state.actionChoices),
		count = Object.values(actionChoices).filter((a) => a === true).length

	if (count == 0) {
		return '.'
	}
	return (
		<span>
			,{' '}
			<span
				css={`
					color: white;
					text-align: center;
					border-radius: 0.3rem;
					background: #77b255;
					margin-right: 0.2rem;
					width: 1.3rem;
					height: 1.8rem;
					font-weight: bold;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					line-height: 0.85rem;
					display: inline-block;
					vertical-align: middle;
				`}
			>
				<animate.appear>
					<div>{count}</div>
					<div title={t('actions choisies')}>&#10004;</div>
				</animate.appear>
			</span>
			<Trans>sélectionnées</Trans>.
		</span>
	)
}
