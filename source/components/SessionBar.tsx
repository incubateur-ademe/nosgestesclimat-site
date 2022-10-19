import { loadPreviousSimulation } from 'Actions/actions'
import useLocalisation from 'Components/localisation/useLocalisation'
import { extractCategories } from 'Components/publicodesUtils'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { answeredQuestionsSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { resetLocalisation } from '../actions/actions'
import ConferenceBarLazy from '../sites/publicodes/conference/ConferenceBarLazy'
import { backgroundConferenceAnimation } from '../sites/publicodes/conference/conferenceStyle'
import SurveyBarLazy from '../sites/publicodes/conference/SurveyBarLazy'
import { omit } from '../utils'
import CardGameIcon from './CardGameIcon'
import {
	getFlagImgSrc,
	getLocalisationPullRequest,
	getSupportedFlag,
	isRegionSupported,
} from './localisation/useLocalisation'
import ProgressCircle from './ProgressCircle'
import { usePersistingState } from './utils/persistState'

const ActionsInteractiveIcon = () => {
	const actionChoices = useSelector((state) => state.actionChoices),
		count = Object.values(actionChoices).filter((a) => a === true).length
	return <CardGameIcon number={count} />
}

const openmojis = {
	test: '25B6',
	action: 'E10C',
	conference: '1F3DF',
	sondage: '1F4CA',
	profile: 'silhouette',
	personas: '1F465',
	github: 'E045',
}
export const openmojiURL = (name) => `/images/${openmojis[name]}.svg`
export const actionImg = openmojiURL('action')
export const conferenceImg = openmojiURL('conference')

const MenuButton = styled.div`
	margin: 0 0.2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 110% !important;
	color: var(--darkColor);
	padding: 0 0.4rem !important;
	@media (min-width: 800px) {
		flex-direction: row;
		justify-content: start;
		padding: 0;
		font-size: 100%;
	}
	img,
	svg {
		display: block;
		font-size: 200%;
		margin: 0.6rem !important;
		@media (max-width: 800px) {
			margin: 0 !important;
		}
		height: auto;
	}
`

const Button = (props) => {
	const location = useLocation(),
		path = location.pathname
	const isCurrent = path.includes(props.url)
	return (
		<Link
			to={props.url}
			css="text-decoration: none"
			{...(isCurrent
				? {
						'aria-current': 'page',
				  }
				: {})}
		>
			<MenuButton {...props} />{' '}
		</Link>
	)
}

export const sessionBarMargin = `
		@media (max-width: 800px) {
			margin-bottom: 10rem;
		}
`

export const buildEndURL = (rules, engine, slide) => {
	const categories = extractCategories(rules, engine),
		detailsString =
			categories &&
			categories.reduce(
				(memo, next) =>
					memo +
					next.name[0] +
					(Math.round(next.nodeValue / 10) / 100).toFixed(2),
				''
			)

	if (detailsString == null) return null

	return `/fin?details=${detailsString}${slide ? `&diapo=${slide}` : ''}`
}

export const useSafePreviousSimulation = () => {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)

	const dispatch = useDispatch()
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const arePreviousAnswers = !!answeredQuestions.length
	useEffect(() => {
		if (!arePreviousAnswers && previousSimulation)
			dispatch(loadPreviousSimulation())
	}, [])
}

export default function SessionBar({
	answerButtonOnly = false,
	noResults = false,
}) {
	useSafePreviousSimulation()

	const conference = useSelector((state) => state.conference)
	const survey = useSelector((state) => state.survey)
	const dispatch = useDispatch()

	const localisation = useLocalisation()
	const flag = isRegionSupported(localisation)
		? getSupportedFlag(localisation)
		: getFlagImgSrc('FR')

	const location = useLocation(),
		path = location.pathname

	const buttonStyle = (pathTarget) =>
		path.includes(pathTarget)
			? `
		font-weight: bold;
		img, svg {
		  background: var(--lighterColor);
		  border-radius: 2rem;
		}
		`
			: ''
	const persona = useSelector((state) => state.simulation?.persona)

	const [searchParams, setSearchParams] = useSearchParams()

	const pullRequestNumber = useSelector((state) => state.pullRequestNumber),
		// We only show the PR in the menu if it's set by the searchQuery,
		// not by the localisation system
		showPullRequestNumber =
			pullRequestNumber &&
			(!localisation ||
				NODE_ENV === 'development' ||
				!(pullRequestNumber === getLocalisationPullRequest(localisation)))

	const [chosenIp, chooseIp] = usePersistingState('IP', undefined)

	const { t } = useTranslation()

	let elements = [
		<Button
			className="simple small"
			url="/simulateur/bilan"
			css={`
				${buttonStyle('simulateur')};
			`}
		>
			<ProgressCircle />
			<Trans>Le test</Trans>
		</Button>,
		<Button
			className="simple small"
			url="/actions/liste"
			css={buttonStyle('/actions')}
		>
			<ActionsInteractiveIcon />
			<Trans>Agir</Trans>
		</Button>,
		<Button className="simple small" url="/profil" css={buttonStyle('profil')}>
			<div
				css={`
					position: relative;
				`}
			>
				<img
					src={openmojiURL('profile')}
					css="width: 2rem"
					aria-hidden="true"
					width="1"
					height="1"
				/>
				{flag && (
					<img
						src={flag}
						css={`
							position: absolute;
							left: 1.45rem;
							top: -0.15rem;
							width: 1.2rem;
							border-radius: 0.3rem !important;
						`}
						aria-hidden="true"
					/>
				)}
			</div>
			{!persona ? (
				t('Mon profil')
			) : (
				<span
					css={`
						background: var(--color);
						color: var(--textColor);
						padding: 0 0.4rem;
						border-radius: 0.3rem;
					`}
				>
					{persona}
				</span>
			)}
		</Button>,
		NODE_ENV === 'development' && (
			<Button
				key="personas"
				className="simple small"
				url="/personas"
				css={buttonStyle('personas')}
			>
				<img
					src={openmojiURL('personas')}
					css="width: 2rem"
					aria-hidden="true"
					width="1"
					height="1"
				/>
				Personas
			</Button>
		),
		showPullRequestNumber && (
			<MenuButton
				key="pullRequest"
				className="simple small"
				css={buttonStyle('github')}
			>
				<a
					href={
						'https://github.com/datagir/nosgestesclimat/pull/' +
						pullRequestNumber
					}
					css={`
						display: flex;
						align-items: center;
					`}
				>
					<img
						src={openmojiURL('github')}
						css="width: 2rem"
						aria-hidden="true"
						width="1"
						height="1"
					/>
					#{pullRequestNumber}
				</a>
				<button
					onClick={() => {
						setSearchParams(omit(['PR'], searchParams))
						dispatch(resetLocalisation())
						chooseIp(undefined)
						dispatch({ type: 'SET_PULL_REQUEST_NUMBER', number: null })
					}}
				>
					<img
						css="width: 1.2rem"
						src="/images/close-plain.svg"
						width="1"
						height="1"
					/>
				</button>
			</MenuButton>
		),
		conference?.room && (
			<GroupModeMenuEntry
				title="Conférence"
				icon={conferenceImg}
				url={'/conférence/' + conference.room}
				buttonStyle={buttonStyle}
			>
				<ConferenceBarLazy />
			</GroupModeMenuEntry>
		),
		survey?.room && (
			<GroupModeMenuEntry
				title="Sondage"
				icon={openmojiURL('sondage')}
				url={'/sondage/' + survey.room}
				buttonStyle={buttonStyle}
			>
				<SurveyBarLazy />
			</GroupModeMenuEntry>
		),
	]

	if (path === '/tutoriel') return null

	return (
		<div
			css={`
				margin: 1rem 0 2rem;

				@media (max-width: 800px) {
					margin: 0;
					position: fixed;
					bottom: 0;
					left: 0;
					z-index: 100;
					width: 100%;
				}
			`}
		>
			{elements.filter(Boolean).length > 0 && (
				<NavBar>
					{elements.filter(Boolean).map((Comp, i) => (
						<li key={i}>{Comp}</li>
					))}
				</NavBar>
			)}
		</div>
	)
}

const NavBar = styled.ul`
	display: flex;
	box-shadow: rgb(187 187 187) 2px 2px 10px;
	list-style-type: none;
	justify-content: space-evenly !important;
	align-items: center;
	height: 3.5rem;
	margin: 0;
	width: 100%;
	height: 4rem;
	background: white;
	justify-content: center;
	padding: 0;

	@media (min-width: 800px) {
		margin-top: 1rem;
		flex-direction: column;
		height: auto;
		background: none;
		justify-content: start;
		box-shadow: none;
		li {
			width: 100%;
		}
	}
`

const GroupModeMenuEntry = ({ title, icon, url, children, buttonStyle }) => {
	return (
		<div
			css={`
				${backgroundConferenceAnimation}
				color: white;
				border-radius: 0.4rem;
				margin-right: 0.6rem;
			`}
		>
			<Button
				className="simple small"
				url={url}
				css={`
					${buttonStyle('conf')}
					padding: 0.4rem;
					color: white;
					img {
						filter: invert(1);
						background: none;
						margin: 0 0.6rem 0 0 !important;
					}
					@media (max-width: 800px) {
						img {
							margin: 0 !important;
						}
					}
				`}
			>
				<img
					src={icon}
					css="width: 2rem"
					aria-hidden="true"
					width="1"
					height="1"
				/>
				{title}
			</Button>
			<div
				css={`
					@media (max-width: 800px) {
						display: none;
					}
				`}
			>
				{children}
			</div>
		</div>
	)
}
