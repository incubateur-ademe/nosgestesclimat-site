import React, { useState } from 'react'
import styled from 'styled-components'

import Tile from '../utils/Tile'
import Table from './sources/Table'

const StyledTile = styled(Tile.Wrapper)`
	> div {
		width: 50%;
		@media screen and (max-width: ${1200}px) {
			width: 100%;
		}
	}
`

const Title = styled.h3`
	text-align: center;
`
export default function Sources(props) {
	const [newWebsites, setNewWebsites] = useState(false)
	return (
		<>
			<Title>Origine des visites</Title>
			<StyledTile>
				{newWebsites ? (
					<Table
						title="Sites Web"
						data={props.websites.filter(
							(website) =>
								!props.oldWebsites.find(
									(oldWebsite) => oldWebsite.label === website.label
								)
						)}
						total={props.total}
						setNewWebsites={setNewWebsites}
						newWebsites={newWebsites}
					/>
				) : (
					<Table
						title="Sites Web"
						data={props.websites}
						total={props.total}
						limit={5}
						setNewWebsites={setNewWebsites}
						newWebsites={newWebsites}
					/>
				)}
				<Table
					title="Réseaux Sociaux"
					data={props.socials}
					total={props.total}
					limit={5}
				/>
			</StyledTile>
		</>
	)
}
