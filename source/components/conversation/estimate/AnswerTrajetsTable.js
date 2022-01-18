import React from 'react'
import styled from 'styled-components'
import { freqList } from './dataHelp'

export default function AnswerTrajetsTable({ trajets }) {
	const trajetsMotif = trajets.reduce((memo, trajet) => {
		const period = freqList.find((f) => f.name === trajet.periode)
		const freqValue = period ? period.value * trajet.xfois : 0
		const dist = (trajet.distance * freqValue) / trajet.personnes

		const currentDistance = memo[trajet.motif] ?? 0
		console.log(currentDistance)
		return {
			...memo,
			[trajet.motif]: currentDistance + Math.round(+dist),
		}
	}, {})

	// 	if (!memo.find((elt) => elt.motif === trajet.motif)) {
	// 		memo.push({
	// 			motif: trajet.motif,
	// 			distance: 0,
	// 		})
	// 	}
	// 	memo.find((elt) => elt.motif === trajet.motif).distance += Math.round(+dist)
	// 	return memo
	// }, [])
	console.log(trajets)
	const trajetsMotifTable = Object.entries(trajetsMotif)
	console.log(trajetsMotifTable)

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
					{trajetsMotifTable.map((trajet) => (
						<tr>
							<td>{trajet[0]}</td>
							<td>{trajet[1]}</td>
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
