import React from 'react'
import styled from 'styled-components'
import { freqList } from './dataHelp'

export default function AnswerTrajetsTable({ trajets }) {
	const trajetsMotif = trajets.reduce((memo, trajet) => {
		const period = freqList.find((f) => f.name === trajet.periode)
		const freqValue = period ? period.value * trajet.xfois : 0
		const dist = (trajet.distance * 2 * freqValue) / trajet.personnes
		if (!memo.find((elt) => elt.motif === trajet.motif)) {
			memo.push({
				motif: trajet.motif,
				distance: 0,
			})
		}
		memo.find((elt) => elt.motif === trajet.motif).distance += Math.round(+dist)
		return memo
	}, [])

	console.log(trajetsMotif)

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
						<th scope="col" css="width: 30%">
							"KM"
						</th>
					</tr>
				</thead>
				<tbody>
					{trajetsMotif.map((trajet) => (
						<tr>
							<td>{trajet.motif}</td>
							<td>{trajet.distance}</td>
						</tr>
					))}
				</tbody>
			</TableTrajets>
		</div>
	)
}

const TableTrajets = styled.table`
	font-family: 'Roboto', sans-serif;
	border-spacing: 0 0.1rem;
	border-collapse: separate !important;
	background: white;
	font-size: 70%;
	table-layout: fixed;
	width: 100%;
	min-width: 10rem;

	td,
	th {
		text-align: center !important;
		padding: 0 !important;
	}

	tr {
		border-radius: 1rem;
	}

	tr:nth-child(2n) {
		background: var(--lighterColor) !important;
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
