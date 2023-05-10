import { goToQuestion } from 'Actions/actions'
import highlightMatches from 'Components/highlightMatches'
import { useEngine } from 'Components/utils/EngineContext'
import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Worker from 'worker-loader!./QuestionFinder.worker.ts'

const worker = new Worker()

type SearchBarProps = {
	showListByDefault?: boolean
	close: () => void
}

type SearchItem = {
	title: string
	dottedName: Object
	espace: Array<string>
}

type Matches = Array<{
	key: string
	value: string
	indices: Array<[number, number]>
}>

export default function QuestionFinder({
	showListByDefault = false,
	close,
}: SearchBarProps) {
	const rules = useEngine().getParsedRules()
	const [input, setInput] = useState('')
	const [results, setResults] = useState<
		Array<{
			item: SearchItem
			matches: Matches
		}>
	>([])
	const { t } = useTranslation()

	const searchIndex: Array<SearchItem> = useMemo(
		() =>
			Object.values(rules)
				.filter((rule) => rule.rawNode.question)
				.map((rule) => ({
					title:
						rule.title +
						(rule.rawNode.acronyme ? ` (${rule.rawNode.acronyme})` : ''),
					dottedName: rule.dottedName,
					espace: rule.dottedName.split(' . ').reverse(),
					question: rule.rawNode.question,
				})),
		[rules]
	)

	const dispatch = useDispatch()

	useEffect(() => {
		worker.postMessage({
			rules: searchIndex,
		})

		worker.onmessage = ({ data: results }) => setResults(results)
		return () => {
			worker.onmessage = null
		}
	}, [searchIndex, setResults])

	return (
		<div
			className="ui__ card box"
			css={`
				max-height: 20rem;
				max-width: 100% !important;
				overflow: scroll;
				position: relative;
			`}
		>
			<button
				css={`
					position: absolute;
					top: 0;
					right: 0;
					padding: 0;
					img {
						width: 1.2rem;
					}
				`}
				onClick={close}
			>
				<img src={'/images/274C.svg'} />
			</button>
			<label title="Naviguez vers une question précise">
				<input
					type="search"
					autoFocus
					className="ui__"
					value={input}
					css="margin: 0 !important"
					placeholder={t('Naviguez vers une question précise')}
					onChange={(e) => {
						const input = e.target.value
						if (input.length > 0) worker.postMessage({ input })
						setInput(input)
					}}
				/>
			</label>
			{!!input.length && !results.length ? (
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
				<ul
					css={`
						padding: 0;
						margin: 0;
						list-style: none;
					`}
				>
					{(showListByDefault && !results.length && !input.length
						? searchIndex
								.filter((item) => item.espace.length === 2)
								.map((item) => ({ item, matches: [] }))
						: results
					)
						.slice(0, showListByDefault ? 100 : 6)
						.map(({ item, matches }) => (
							<li key={item.dottedName}>
								<button
									onClick={() => {
										dispatch(goToQuestion(item.dottedName))
										close()
									}}
								>
									<div>
										<small>
											{item.espace
												.slice(1)
												.reverse()
												.map((name) => (
													<span key={name}>
														{highlightMatches(
															name,
															matches.filter(
																(m) => m.key === 'espace' && m.value === name
															)
														)}{' '}
														›{' '}
													</span>
												))}
											{highlightMatches(
												item.title,
												matches.filter((m) => m.key === 'title')
											)}
										</small>
									</div>
									<p>
										{item.question.slice(0, 100)}
										{item.question.length > 100 ? '...' : ''}
									</p>
								</button>
							</li>
						))}
				</ul>
			)}
		</div>
	)
}
