import { skipTutorial } from 'Actions/actions'
import SlidesLayout from 'Components/SlidesLayout'
import Meta from 'Components/utils/Meta'
import useKeypress from 'Components/utils/useKeyPress'
import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TrackerContext } from '../../../contexts/TrackerContext'
import HorizontalSwipe from '../HorizontalSwipe'
import Categories from './Categories'
import ClimateWarming from './ClimateWarming'
import Instructions from './Instructions'
import Target from './Target'
import Slide from './TutorialSlide'
import WarmingMeasure from './WarmingMeasure'

export default ({}) => {
	const navigate = useNavigate()
	const tutorials = useSelector((state) => state.tutorials)

	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const enquête = useSelector((state) => state.enquête)
	const slides = createSlides(enquête)
	const index = tutos.length

	const skip = (name, unskip) => dispatch(skipTutorial(name, unskip)),
		last = index === slides.length - 1,
		next = () => {
			tracker.push([
				'trackEvent',
				'testIntro',
				last ? `tuto passé` : `diapo ${index} passée`,
			])

			skip(last ? 'testIntro' : 'testIntro' + index)
			if (last) {
				navigate('/simulateur/bilan')
			}
		},
		previous = () => dispatch(skipTutorial('testIntro' + (index - 1), true))

	useKeypress('Escape', false, () => skip('testIntro'), 'keyup', [])

	const Component = slides[index]

	const dispatch = useDispatch()
	const tracker = useContext(TrackerContext)

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we correct the bug in the user's cache
	useEffect(() => {
		if (Object.keys(tutorials).includes('testIntro5'))
			dispatch(skipTutorial('testIntro'))
	}, [tutorials])

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we avoid an error
	if (null === slides[index]) {
		return null
	}

	// FIXME: cannot use useTranslation here...
	// const { t } = useTranslation()

	const title = 'Tutorial'
	const description =
		'Parcourez le tutoriel Nos Gestes Climat avant de débuter votre simulation.'

	return (
		<>
			<Meta title={title} description={description} />
			<SlidesLayout length={slides.length} active={index}>
				<HorizontalSwipe {...{ next, previous }}>
					<Slide
						{...{
							last,
							skip,
						}}
					>
						<Component />
					</Slide>
				</HorizontalSwipe>
			</SlidesLayout>
		</>
	)
}

const createSlides = (noBias) => {
	if (noBias) return [ClimateWarming, WarmingMeasure, Instructions]
	return [ClimateWarming, WarmingMeasure, Target, Categories, Instructions]
}
