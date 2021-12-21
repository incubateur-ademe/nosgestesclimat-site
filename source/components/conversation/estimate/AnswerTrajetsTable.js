import React from 'react'
import styled from 'styled-components'

export default function AnswerTrajetsTable({ trajets }) {
	return (
		<div
			css={`
				overflow: auto;
				padding: 0rem 0.5rem 0rem 0.5rem;
			`}
		>
			<TableTrajets>
				<thead>
					<tr>
						<th scope="col">Motif</th>
						<th scope="col" css="width: 22%">
							Label
						</th>
						<th scope="col" css="width: 10%">
							"KM"
						</th>
						<th scope="col" css="width: 25%">
							Fréquence
						</th>
						<th
							scope="col"
							css="width: 10%; color: transparent; text-shadow: 0 0 0 white;"
						>
							👥
						</th>
					</tr>
				</thead>
				<tbody>
					{trajets.map((trajet) => (
						<tr>
							<td>{trajet.motif}</td>
							<td>{trajet.label}</td>
							<td>{trajet.distance}</td>
							<td>
								{trajet.xfois} x / {trajet.periode}
							</td>
							<td>{trajet.personnes}</td>
						</tr>
					))}
				</tbody>
			</TableTrajets>
		</div>
	)
}

const TableTrajets = styled.table`
	font-family: 'Roboto', sans-serif;
	border-spacing: 0 0.5rem;
	border-collapse: separate !important;
	background: white;
	font-size: 70%;
	table-layout: fixed;
	width: 100%;
	min-width: 20rem;

	td,
	th {
		text-align: center !important;
		padding: 0 !important;
	}

	tr {
		border-radius: 1rem;
	}

	thead th {
		background: var(--color);
		font-weight: normal !important;
		text-transform: uppercase;
		letter-spacing: 0.03rem;
		color: #ffffff;
	}

	thead tr {
		height: 1rem;
	}

	tbody tr {
		height: 1rem;
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
	}

	th:first-child,
	td:first-child {
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}
	th:last-child,
	td:last-child {
		border-bottom-right-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}
`
