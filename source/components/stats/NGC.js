import React from 'react'
import styled from 'styled-components'

import Tile from './utils/Tile'
import Section from './utils/Section'
import NumSimulations from './NumSimulations'
import NumForks from './NumForks'

export default function Misc() {
	return (
		<Section>
			<Section.Title>Nos GEStes Climat en chiffres</Section.Title>
			<Tile.Wrapper>
				<NumSimulations />
				<NumForks />
			</Tile.Wrapper>
		</Section>
	)
}
