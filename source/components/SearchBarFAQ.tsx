import highlightMatches from '@/components/highlightMatches'
import '@/components/SearchBar.css'
import { getCurrentLangInfos } from '@/locales/translation'
import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Worker from 'worker-loader!./SearchBarFAQ.worker.js'

const worker = new Worker()

type SearchItem = {
	id: string
	question: string
	réponse: string
}

type Matches = Array<{
	key: string
	value: string
	indices: Array<[number, number]>
}>

export default function SearchBarFAQ() {
	const { i18n } = useTranslation()
	const questions = getCurrentLangInfos(i18n).faqContent

	const [input, setInput] = useState('')
	const [results, setResults] = useState<
		Array<{
			item: SearchItem
			matches: Matches
		}>
	>([])

	const searchIndex: Array<SearchItem> = useMemo(
		() =>
			Object.values(questions).map((question) => {
				return {
					id: question.id,
					question: question.question,
					réponse: question.réponse,
				}
			}),
		[questions]
	)

	useEffect(() => {
		worker.postMessage({
			questions: searchIndex,
		})

		worker.onmessage = ({ data: results }) => setResults(results)
		return () => {
			worker.onmessage = null
		}
	}, [searchIndex, setResults])
	const { t } = useTranslation()

	return (
		<>
			<label
				title={t('Entrez des mots clefs')}
				css={`
					margin: 0.6rem 0;
					display: flex;
					align-items: center;
					height: 2rem;
				`}
			>
				<img
					src="/images/1F50D.svg"
					width="100px"
					height="100px"
					css={`
						width: 3rem;
					`}
				/>
				<input
					autoFocus
					type="search"
					className="ui__"
					value={input}
					placeholder={t('Entrez des mots clefs ici')}
					onChange={(e) => {
						const input = e.target.value
						if (input.length > 0) worker.postMessage({ input })
						setInput(input)
					}}
				/>
			</label>
			{input.length > 2 && !results.length ? (
				<p
					role="status"
					className="ui__ notice light-bg"
					css={`
						padding: 0.4rem;
						border-radius: 0.3rem;
						margin-top: 0.6rem;
					`}
				>
					<Trans i18nKey="noresults">
						Aucun résultat ne correspond à cette recherche
					</Trans>
				</p>
			) : (
				input.length > 2 && (
					<ul
						css={`
							padding-left: 1rem;
							margin: 0;
							list-style: none;
						`}
					>
						{(!results.length && !input.length
							? searchIndex.map((item) => ({ item, matches: [] }))
							: results
						).map(({ item, matches }) => (
							<QuestionListItem {...{ item, matches }} />
						))}
					</ul>
				)
			)}
		</>
	)
}

export const QuestionListItem = ({
	item,
	matches = null,
}: {
	item: SearchItem
	matches: Matches | null
}) => (
	<li
		key={item.id}
		css={`
			margin: 0.4rem 0;
			padding: 0.6rem 0.6rem;
			border-bottom: 1px solid var(--lighterColor);
			small {
				display: block;
			}
		`}
	>
		<Link
			to={`/questions-frequentes#${item.id}`}
			css={`
				text-decoration: none;
			`}
		>
			{matches
				? highlightMatches(
						item.question,
						matches.filter((m) => m.key === 'question')
				  )
				: item.question}
		</Link>
	</li>
)
