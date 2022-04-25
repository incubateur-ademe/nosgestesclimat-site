import { useSelector } from 'react-redux'
import { extractCategories } from '../../../components/publicodesUtils'
import ShareButton from '../../../components/ShareButton'
import { useEngine } from '../../../components/utils/EngineContext'
import { range } from '../../../utils'

export default ({ textColor }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const categories = extractCategories(rules, engine).map((category) => ({
		...category,
		abbreviation: rules[category.dottedName].abbréviation,
	}))
	const shareText = generateShareText(categories)
	console.log(shareText)
	return (
		<div css="display: flex; flex-direction: column; margin: .2rem 0">
			<ShareButton
				text={shareText}
				url={window.location}
				title={'Nos Gestes Climat'}
				color={textColor}
				label="Partager mes résultats"
			/>
		</div>
	)
}

// TODO
// On twitter, these take 2 space slots, on telegram only one.
// We may need to change them...
const space = (icon) => ({ '🍽': true, '🏘': true }[icon])

const generateShareText = (categories) => {
	const graph = categories
		.map(({ icons, nodeValue }) => {
			const badCount = Math.round(nodeValue / 500),
				goodCount = 7 - badCount,
				gameOver = goodCount > 7

			return (
				`${icons}${space(icons) ? '' : ' '}` +
				range(1, badCount)
					.map(() => '⬛️')
					.join('') +
				range(1, goodCount)
					.map(() => '🟩')
					.join('') +
				(gameOver ? '🧨' : '')
			)
		})
		.join('\n')

	return `

Voilà mon empreinte 🌍️ climat. 

${graph}

Mesure la tienne sur nosgestesclimat.fr !`
}
