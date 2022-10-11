import styled from 'styled-components'
import { Trans } from 'react-i18next'

import Tile from '../../utils/Tile'

const Wrapper = styled.table`
	table-layout: fixed;
	width: 100%;
	margin-bottom: 0.5rem;
	background-color: #fff;
	border-bottom: 2px solid #f0f0f0;
	border-collapse: collapse;
	overflow: hidden;

	tr:nth-child(2n + 1) {
		background-color: #f9f8f6;
	}

	th {
		padding: 0.75rem 0 0.75rem 0.75rem;
		font-size: 0.875rem;
		text-align: left;
		border-bottom: 2px solid #1e1e1e;
	}
	td {
		font-size: 0.8125rem;
		width: 60%;
		padding: 0.5rem;
	}
	td + td,
	th + th {
		width: 20%;
		font-weight: 700;
		text-align: right;
	}
`
const Text = styled.p`
	margin: 0;
	font-size: 0.75rem;
	font-weight: 300;
	text-align: right;
`
const Toggle = styled.button`
	display: inline;
	margin: 0;
	padding: 0;
	font-size: 0.65rem;
	color: var(--color);
	background: none;
	border: none;
	cursor: pointer;
`
export default function Table(props) {
	return (
		<Tile.Tile>
			<Tile.Content>
				<Wrapper>
					<tbody>
						<tr>
							<th>
								{props.title}{' '}
								{props.setNewWebsites && (
									<Toggle
										onClick={() =>
											props.setNewWebsites(
												(prevNewWebsites) => !prevNewWebsites
											)
										}
									>
										({props.newWebsites ? 'Voir tous' : 'Voir les nouveaux'})
									</Toggle>
								)}
							</th>
							<th>Visites</th>
							<th>%</th>
						</tr>
						{props.data &&
							props.data.map(
								(line, index) =>
									(!props.limit || index < props.limit) && (
										<tr key={line.label + line.nb_visits}>
											<td>{line.label}</td>
											<td>
												{line.nb_visits
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}
											</td>
											<td>
												{props.total &&
													Math.round((line.nb_visits / props.total) * 10000) /
														100}
												%
											</td>
										</tr>
									)
							)}
					</tbody>
				</Wrapper>
				<Text>
					<Trans>Données valables pour les 30 derniers jours</Trans>
				</Text>
			</Tile.Content>
		</Tile.Tile>
	)
}
