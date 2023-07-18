import { useState } from 'react'
import styled from 'styled-components'

import budget from './budget.yaml'
import RessourcesAllocationTable from './RessourcesAllocationTable'

const SelectWrapper = styled.div`
	display: inline-flex;
	align-items: center;
	margin-bottom: 1rem;
`
const StyledSelect = styled.select`
	width: 10rem;
	margin-left: 1rem;
	margin-bottom: 0;
`
export default function SelectYear() {
	const years = Object.keys(budget)
	const [selectedYear, setSelectedYear] = useState(years[years.length - 1])
	const products = Object.keys(budget[selectedYear]).filter(
		(elt) => elt !== 'description'
	)
	const categories = [
		...new Set(
			products
				.map((q) => Object.keys(budget[selectedYear]?.[q] ?? {}))
				.reduce((acc, curr) => [...acc, ...curr], [])
		),
	]

	return (
		<>
			<SelectWrapper>
				<b>Année :</b>
				<StyledSelect
					css={`
						width: 10rem;
						margin-left: 1rem;
						margin-bottom: 0;
					`}
					name="année"
					className="ui__"
					value={selectedYear}
					onChange={(e) => {
						setSelectedYear(e.target.value)
					}}
				>
					{years.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</StyledSelect>
			</SelectWrapper>
			<p>{budget[selectedYear]?.['description']}</p>
			<RessourcesAllocationTable
				selectedYear={selectedYear}
				budget={budget}
				products={products}
				categories={categories}
			/>
		</>
	)
}
