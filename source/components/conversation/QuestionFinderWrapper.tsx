import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { enquêteSelector } from '../../sites/publicodes/enquête/enquêteSelector'
import QuestionFinder from './QuestionFinder'

export default function QuestionFinderWrapper({ finder, setFinder }) {
	const enquête = useSelector(enquêteSelector)
	if (enquête) return null

	return finder ? (
		<Suspense fallback={<div>Chargement</div>}>
			<QuestionFinder close={() => setFinder(false)} />
		</Suspense>
	) : (
		<div
			css={`
				position: absolute;
				top: 0;
				right: 0;
				line-height: 1rem;
				button {
					padding: 0;
					display: flex;
					align-items: center;
					color: var(--color);
				}
				img {
					width: 1.2rem;
					padding-top: 0.1rem;
				}
				span {
					display: none;
					font-weight: bold;
					font-size: 70%;
					margin-right: 0.3rem;
				}
				@media (min-width: 800px) {
					span {
						display: inline;
					}
				}
			`}
		>
			<button
				onClick={() => setFinder(!finder)}
				title="Recherche rapide de questions dans le formulaire"
			>
				<img src={`/images/1F50D.svg`} aria-hidden="true" />
				<span>Ctrl-K</span>
			</button>
		</div>
	)
}
