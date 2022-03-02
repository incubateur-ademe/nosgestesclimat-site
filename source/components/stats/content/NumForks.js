import React from 'react'
import styled from 'styled-components'

import Tile from '../utils/Tile'

const Number = styled.span`
	display: block;
	font-size: 6rem;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: ${(props) => props.color || props.theme.colors.main};
	transition: color 500ms ease-out;
`
const Label = styled.span`
	text-align: center;
	font-size: 1.25rem;
	font-weight: 700;
`
export default function NumForks() {
	return (
		<Tile.Tile>
			<Tile.Content color="#46479f">
				<Number color="#46479f">30</Number>
				<Label>reprises du code</Label>
			</Tile.Content>
		</Tile.Tile>
	)
}
