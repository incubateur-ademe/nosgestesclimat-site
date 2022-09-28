import styled from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'

import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../../locales/translation'

const Wrapper = styled.div`
	padding: 1rem;
	background-color: #fff;
	border: 1px solid #f0f0f0;
`
const Label = styled.div`
	line-height: 1.5;
	color: #6a6a6a;
	&::first-letter {
		text-transform: uppercase;
	}
`
const Number = styled.span`
	font-size: 1.125rem;
	font-weight: 700;
`
export default function CustomTooltip(props) {
	const label = props.label && props.label.replace(/\s/g, ' ')
	const { t, i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	return props.active && props.payload && props.payload.length ? (
		<Wrapper>
			{label === '30+ min' ? (
				<Label>
					<Trans>Plus de 30 minutes</Trans>
				</Label>
			) : (
				<Label>
					{t('Entre') + ' '}
					{label.split('-')[0].toLocaleString(currentLangInfos.abrvLocale)}{' '}
					{t('et') + ' '}
					{label
						.split('-')[1]
						.split(' ')[0]
						.toLocaleString(currentLangInfos.abrvLocale)}{' '}
					{t('minutes')}
				</Label>
			)}
			<Number>
				{props.payload[0].value
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
			</Number>
			{props.naming || t('visites')}
		</Wrapper>
	) : null
}
