import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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
	const { t, i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	return props.active && props.payload && props.payload.length ? (
		<Wrapper>
			{props.period === 'week' && (
				<Label>
					Semaine du{' '}
					{new Date(props.label.split(',')[0]).toLocaleDateString(
						currentLangInfos.abrvLocale,
						{
							day: '2-digit',
							month: '2-digit',
						}
					)}{' '}
					au{' '}
					{new Date(props.label.split(',')[1]).toLocaleDateString(
						currentLangInfos.abrvLocale,
						{
							day: '2-digit',
							month: '2-digit',
						}
					)}
				</Label>
			)}
			{props.period === 'month' && (
				<Label>
					{new Date(props.label).toLocaleDateString(
						currentLangInfos.abrvLocale,
						{
							month: 'long',
							year: 'numeric',
						}
					)}
				</Label>
			)}
			{props.period === 'day' && (
				<Label>
					{new Date(props.label).toLocaleDateString(
						currentLangInfos.abrvLocale,
						{
							weekday: 'long',
							day: '2-digit',
							month: 'long',
						}
					)}
				</Label>
			)}
			<Number>
				{props.payload[0].value
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}{' '}
			</Number>
			{props.naming || t('visites')}
		</Wrapper>
	) : null
}
