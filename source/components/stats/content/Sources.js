import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation()

	return (
		<>
			<Title>
				<Trans>Origine des visites</Trans>
			</Title>
			<StyledTile>
				{newWebsites ? (
					<Table
						title={t('Sites Web')}
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
						title={t('Sites Web')}
						data={props.websites}
						total={props.total}
						limit={5}
						setNewWebsites={setNewWebsites}
						newWebsites={newWebsites}
					/>
				)}
				<Table
					title={t('Réseaux Sociaux')}
					data={props.socials}
					total={props.total}
					limit={5}
				/>
			</StyledTile>
		</>
	)
}
