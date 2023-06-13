import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { extractCategories } from '../../../components/publicodesUtils'
import ShareButton from '../../../components/ShareButton'
import { useEngine } from '../../../components/utils/EngineContext'
import { range } from '../../../utils'

export default ({ textColor, showResult, label }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const categories = extractCategories(rules, engine).map((category) => ({
		...category,
		abbreviation: rules[category.dottedName].abréviation,
	}))
	const total = Math.round(engine.evaluate('bilan').nodeValue / 1000)
	const shareText = generateShareText(categories, total)
	const { t } = useTranslation()
	if (showResult)
		return <textarea value={shareText} css="height: 12rem; width: 16rem" />
	return (
		<div css="display: flex; flex-direction: column; margin: .2rem 0">
			<ShareButton
				text={shareText}
				url={'https://nosgestesclimat.fr'}
				title={'Nos Gestes Climat'}
				color={textColor}
				label={label ?? t('Partager mes résultats')}
			/>
		</div>
	)
}

const gridWidth = 7,
	pixelFactor = 500
const nEmojis = (n, emoji) =>
	range(1, n)
		.map(() => emoji)
		.join('')
const generateShareText = (categories, total) => {
	const graph = categories
		.map(({ icons, nodeValue }) => {
			const badCountRaw = Math.round(nodeValue / pixelFactor),
				badCount = Math.min(gridWidth, badCountRaw),
				goodCount = Math.max(gridWidth - badCount, 0),
				gameOver = badCountRaw > gridWidth

			return (
				`${icons} ` +
				(gameOver
					? nEmojis(gridWidth - 1, '⬛️') + '💣️'
					: nEmojis(badCount, '⬛️') + nEmojis(goodCount, '🟩'))
			)
		})
		.join('\n')

	return `#nosgestesclimat 🌍️

${total} tonnes CO2e / an ⬇️

${graph}
`
}
