import styled from 'styled-components'

const Wrapper = styled.div`
	overflow: auto;
`
const Table = styled.table`
	margin-bottom: 2rem;
	width: 100%;
	text-align: left;

	td {
		padding: 0.375rem;
		width: 6.25rem;
	}

	td:not(:first-child) {
		text-align: right;
	}

	tbody tr:nth-child(odd) {
		background: var(--lighterColor);
	}

	thead,
	tfoot {
		font-weight: bold;
	}
`
const arraySum = (arr) => arr.reduce((a, b) => (!isNaN(b) ? a + b : a), 0)

const formatValue = (value) =>
	!isNaN(value) ? value.toLocaleString('fr-FR') : '-'

export default function RessourcesAllocationTable(props) {
	return (
		<Wrapper>
			<Table>
				<thead>
					<tr>
						<td>{props.selectedYear}</td>
						<td>Total</td>
					</tr>
				</thead>
				<tbody>
					{props.categories.map((label) => (
						<tr key={label}>
							<td>{label}</td>
							<td>
								{formatValue(
									arraySum(
										props.products.map(
											(q) => props.budget[props.selectedYear]?.[q]?.[label] ?? 0
										)
									)
								)}
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<td>Total TTC</td>
						<td>
							{formatValue(
								arraySum(
									props.products.map((q) =>
										arraySum(
											Object.values(props.budget[props.selectedYear]?.[q] ?? {})
										)
									)
								)
							)}
						</td>
					</tr>
				</tfoot>
			</Table>
		</Wrapper>
	)
}
