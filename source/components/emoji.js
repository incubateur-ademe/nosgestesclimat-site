import styled from 'styled-components'
import twemoji from 'twemoji'

// This file looks like a gaz factory, as we say in french. Feel free to rewrite it

// Here text should be limited to emojis. Nothing else

export const getEmojiComponents = (text, title) => {
	const attributesCallback = () => {
		return {
			'aria-label': title ? title : '',
			'aria-hidden': title ? 'false' : 'true',
		}
	}
	const parts = twemoji
		.parse(text, {
			attributes: attributesCallback,
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
// For markdown, according to changes in commit 4463b011c9f33db73b8922898355330cc5726bf3
// emojis in files are decorative by default
// on way to change emojis in md file to attribute an alternative is the following code :
// <span role="img" aria-label="micro" aria-hidden="false">🎤 </span>

export const Twemoji = ({ text, label }) => {
	const attributesCallback = () => {
		return {
			'aria-label': label ? label : '',
			'aria-hidden': label ? 'false' : 'true',
			width: '1',
			height: '1',
		}
	}

	const parsed = twemoji.parse(text, {
		attributes: attributesCallback,
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

export default (text, label) => {
	return <Twemoji text={text} label={label} />
}

const EmojiStyle = styled.span`
	img {
		height: 1em;
		width: auto;
		margin: 0 0.2rem;
		vertical-align: -0.125em;
	}
`
