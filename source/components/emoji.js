import styled from 'styled-components'
import twemoji from 'twemoji'

const Twemoji = ({ text }) => (
	<EmojiStyle
		dangerouslySetInnerHTML={{
			__html: twemoji.parse(text, {
				folder: 'svg',
				ext: '.svg',
			}),
		}}
	/>
)

export default (text) => {
	return <Twemoji text={text} />
}

const EmojiStyle = styled.span`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	img {
		height: 1em;
		width: auto;
		margin: 0 0.2rem;
	}
	vertical-align: -0.125em;
`
