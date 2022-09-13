import { humanWeight } from '../HumanWeight'
import { useTranslation } from 'react-i18next'

export default ({ nodeValue, color, completed, demoMode }) => {
	const [value, unit] = humanWeight(nodeValue, true)
	const { t } = useTranslation()

	return (
		<span
			css={`
				color: ${color || 'var(--textColorOnWhite)'};
				font-weight: 600;
				display: flex;
				align-items: center;
			`}
		>
			{value}&nbsp;{unit}
			<img
				src="/images/2714.svg"
				alt={t('catégorie complétée')}
				css={`
					visibility: ${completed ? 'visible' : 'hidden'};
					display: inline;
					${demoMode && `display: none`};
					width: 1.2rem;
					margin-left: 0.2rem;
				`}
			/>
		</span>
	)
}
