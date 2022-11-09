import styled from 'styled-components'

import FancySelect from '../../utils/FancySelect'

import { Trans, useTranslation } from 'react-i18next'
import { range } from '../../../../utils'

const Wrapper = styled.div`
	margin-bottom: 0.5rem;
	text-align: right;

	@media screen and (max-width: ${800}px) {
		font-size: 0.75rem;
	}
`
export default function Search(props) {
	const { t, i18n } = useTranslation()

	return (
		<Wrapper>
			<Trans>Nombre de visites pour les</Trans>{' '}
			<FancySelect
				fancy
				value={props.date}
				onChange={(e) => {
					props.setDate(e)
				}}
				options={range(4, 31).map((elt) => ({
					value: String(elt),
					label: String(elt),
				}))}
			/>{' '}
			{props.period === 'week' ? t('dernières') : t('derniers')}{' '}
			<FancySelect
				fancy
				value={props.period}
				onChange={props.setPeriod}
				options={[
					{ value: 'day', label: t('jours') },
					{ value: 'week', label: t('semaines') },
					{ value: 'month', label: t('mois') },
				]}
			/>
		</Wrapper>
	)
}
