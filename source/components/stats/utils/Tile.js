import React from 'react'
import styled from 'styled-components'

const TileWrapper = styled.div`
	width: 25rem;
	margin-bottom: 1rem;
	padding: 0 0.5rem;
`
const Content = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	padding: 1.5rem 1.5rem 1.8125rem;
	&:before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 0.3125rem;
	}
`
const Top = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`
const Bottom = styled.div``

const Title = styled.h3``
const Text = styled.p``
const ButtonWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
`
export default function Tile(props) {
	return (
		<TileWrapper>
			<Content color={props.color}>
				<Top>
					{props.title && <Title margin={props.margin}>{props.title}</Title>}
					{props.text && <Text>{props.text}</Text>}
				</Top>
				<Bottom>
					{props.link && (
						<ButtonWrapper>
							<button>{props.linkLabel || 'En savoir +'}</button>
						</ButtonWrapper>
					)}
				</Bottom>
			</Content>
		</TileWrapper>
	)
}

Tile.Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: 0 -0.5rem;
`
Tile.Tile = TileWrapper
Tile.Content = Content
Tile.Title = Title
