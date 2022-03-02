import React from 'react'
import styled from 'styled-components'

import FancySelect from '../../utils/FancySelect'

import { range } from '../../../../utils'

const Wrapper = styled.div`
	margin-bottom: 0.5rem;
	text-align: right;

	@media screen and (max-width: ${800}px) {
		font-size: 0.75rem;
	}
`
export default function Search(props) {
	return (
		<Wrapper>
			Nombre de visites pour les{' '}
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
			derni
			{props.period === 'week' ? 'ère' : 'er'}s{' '}
			<FancySelect
				fancy
				value={props.period}
				onChange={props.setPeriod}
				options={[
					{ value: 'day', label: 'jours' },
					{ value: 'week', label: 'semaines' },
					{ value: 'month', label: 'mois' },
				]}
			/>
		</Wrapper>
	)
}
