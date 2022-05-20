import styled from 'styled-components'
import { range } from 'ramda'
import CircledEmojis from '../../../components/CircledEmojis'

export default ({ pixelRemSize, elements, pixel }) => (
	<Grid pixelRemSize={pixelRemSize}>
		{elements.map((element) => {
			const length = Math.round(element.nodeValue / pixel)
			/* This math.round creates the override of the grid by a few items,
			 * making it not 10x10 but e.g. 10x10 + 3 */
			return range(0, length).map((i) => (
				<li
					title={`${element.title} (${element.topCategoryTitle})`}
					css={`
						background: ${element.topCategoryColor};
					`}
				>
					{true && (
						<CircledEmojis
							emojis={element.icons}
							emojiBackground={'transparent'}
						/>
					)}
				</li>
			))
		})}
	</Grid>
)

const Grid = styled.ul`
	padding: 0;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
	@media (min-width: 800px) {
		width: 95%;
	}
	max-width: ${(props) => 10 * props.pixelRemSize}rem;
	margin: 0 auto;
	/* The grid will not be centered horizontally. This may be achieved via CSS grids, but it took me more than 15 minutes to not figure out how to do it 
					 * Another interesting layout would be a snake layout, but it's not simple either : 
					 * https://stackoverflow.com/questions/59481712/flexbox-reverse-direction-on-wrap-snake-wrap
					 * */

	li {
		list-style-type: none;
		width: ${(props) => props.pixelRemSize}rem;
		height: ${(props) => props.pixelRemSize}rem;
		box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 8px 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 1.4rem;
		font-size: 90%;
	}
`
