import styled from 'styled-components'

import Table from './sources/Table'

import Tile from '../utils/Tile'

const FigureWrapper = styled.div`
	width: 100%;
	text-align: center;
	padding-top: 0rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
`

const TileWrapper = styled(Tile.Tile)`
	width: 100%;
	@media screen and (max-width: ${1200}px) {
		width: 50%;
	}
`

const Number = styled.span`
	display: block;
	font-size: 5rem;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: var(--color);
	transition: color 500ms ease-out;
	display: inline-flex;
	align-items: flex-end;
	justify-content: center;
`
const Small = styled(Number)`
	font-size: 3.5rem;
`
const Label = styled.span`
	text-align: center;
	font-size: 1.25rem;
	font-weight: 700;
`

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

export default function IframeFigures(props) {
	const [iframes, activeIframes] =
		props.pages &&
		props.activePages &&
		getIframeRate(props.pages, props.activePages)
	const [iframePages, totalIframe] =
		props.pages && getIdentifiedIframes(props.pages)

	return (
		<div>
			<FigureWrapper>
				<TileWrapper>
					<Tile.Content>
						<Number>
							{' '}
							{Math.round(iframes).toLocaleString('fr-FR')}
							<Small>&nbsp;%</Small>
						</Number>
						<Label>des vistes affichées en iframe</Label>
					</Tile.Content>
				</TileWrapper>
				<TileWrapper>
					<Tile.Content>
						<Number>
							{' '}
							{Math.round(activeIframes).toLocaleString('fr-FR') || '-'}
							<Small>&nbsp;%</Small>
						</Number>
						<Label>des visites en iframe sont actives</Label>
					</Tile.Content>
				</TileWrapper>
			</FigureWrapper>
			<Tile.Tile>
				<Tile.Content>
					<Wrapper>
						<tbody>
							<tr>
								<th>Intégrateurs identifiés</th>
								<th>Visites</th>
								<th>%</th>
							</tr>
							{iframePages &&
								iframePages.map(
									(line, index) =>
										index < 5 && (
											<tr key={line.label + line.entry_nb_visits}>
												<td>{line.label}</td>
												<td>
													{line.entry_nb_visits
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}
												</td>
												<td>
													{totalIframe &&
														Math.round(
															(line.entry_nb_visits / totalIframe) * 10000
														) / 100}
													%
												</td>
											</tr>
										)
								)}
						</tbody>
					</Wrapper>
					<Text>Données valables pour les 30 derniers jours</Text>
				</Tile.Content>
			</Tile.Tile>
		</div>
	)
}

// for iframe rate we consider as iframe url pages which include 'iframe' and inactive landing pages
const getIframeRate = (pages, activePages) => {
	const totalPages = pages.reduce((acc, cur) => acc + cur.entry_nb_visits, 0)

	const iframePages = pages.filter((page) => page.label?.includes('iframe'))

	const totalIframe = iframePages.reduce(
		(acc, cur) => acc + cur.entry_nb_visits,
		0
	)

	const activeIframePages = activePages.filter((page) =>
		page.label?.includes('iframe')
	)

	const totalActiveIframe = activeIframePages.reduce(
		(acc, cur) => acc + cur.entry_nb_visits,
		0
	)

	// const landingPage = pages.find((obj) => obj.label === '/index')

	// const exitLandingPage = landingPage.exit_nb_visits * 0.6 // 60% of exit are considered as iframes (arbitrary value)

	// const approximatedTotalIframes = exitLandingPage + totalIframe

	const iframes = (totalIframe / totalPages) * 100

	const activeIframes = (totalActiveIframe / totalIframe) * 100

	return [iframes, activeIframes]
}

const getIdentifiedIframes = (pages) => {
	const iframePages = pages
		.filter((page) => page.label?.includes('iframe'))
		.map((page) => {
			if (!page.url) {
				return [...page.subtable]
			} else {
				page.label = page.label.split('/')[3]
				return page
			}
		})
		.flat()

	const combined = iframePages.reduce((a, obj) => {
		if (!a[obj.label]) {
			a[obj.label] = obj
			return a
		} else {
			Object.entries(obj).map(
				([key, value]) =>
					key !== 'label' &&
					(a[obj.label][key] = (a[obj.label][key] || 0) + value)
			)
			return a
		}
	}, {})

	const totalIframe = Object.values(combined).reduce(
		(acc, cur) => acc + cur.entry_nb_visits,
		0
	)

	return [iframePages, totalIframe]
}
