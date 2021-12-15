import styled from 'styled-components'
import twemoji from 'twemoji'

// This file looks like a gaz factory, as we say in french. Feel free to rewrite it

// Here text should be limited to emojis. Nothing else
export const getEmojiComponents = (text) => {
	const parts = twemoji
		.parse(text, {
			folder: 'svg',
			ext: '.svg',
		})
		.split('<img')
		.map((el) => el && '<img' + el)
		.filter(Boolean)

	return parts.map((part) => (
		<EmojiStyle
			dangerouslySetInnerHTML={{
				__html: part,
			}}
		/>
	))
}

// Here text can include emojis and text
export const Twemoji = ({ text }) => {
	const parsed = twemoji.parse(text, {
		folder: 'svg',
		ext: '.svg',
	})

	return parsed.includes('<img class="emoji"') ? (
		<EmojiStyle
			dangerouslySetInnerHTML={{
				__html: parsed,
			}}
		/>
	) : (
		text
	)
}

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
