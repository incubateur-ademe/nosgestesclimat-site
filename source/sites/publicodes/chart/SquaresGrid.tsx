import { motion } from 'framer-motion'
import { range } from 'ramda'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SafeCategoryImage from '../../../components/SafeCategoryImage'

const delayPerPixel = 0.0025
export default ({ pixelRemSize, elements, pixel, gridLength, pixelMargin }) => {
	const originOffset = useRef({ top: 0, left: 0 })

	const [isVisible, setVisibility] = useState(false)

	useEffect(() => {
		let timer = setTimeout(() => setVisibility(true), 400)
		return () => {
			clearTimeout(timer)
		}
	}, [])

	const ponderedElementsRaw = elements
		.map((element) => {
			const decimalLength = element.nodeValue / pixel
			const length = Math.round(decimalLength)
			return range(0, length).map((i) => ({ ...element, i }))
		})
		.flat()

	// The rounding makes the grid longer or shorter by 0, 1, 2 elements
	// Instead of doing things perfectly, we trim or extend the grid artificially by the end
	// considering that the error in our case is not a serious problem
	// If you want to minimize the visual error, feel free ;)
	const squareSurplus = ponderedElementsRaw.length - gridLength,
		removeLast = (array, n) => array.slice(0, -n),
		duplicateLast = (array, n) => [
			...array,
			...range(0, n).map(() => array.splice(-1)[0]),
		],
		ponderedElements =
			squareSurplus <= 0
				? duplicateLast(ponderedElementsRaw, -squareSurplus)
				: removeLast(ponderedElementsRaw, squareSurplus)

	return (
		<Grid
			pixelRemSize={pixelRemSize}
			pixelMargin={pixelMargin}
			gridLength={gridLength}
		>
			<motion.div initial={false} animate={isVisible ? 'visible' : 'hidden'}>
				{ponderedElements.map((element, i) => (
					<GridItem
						key={i}
						i={i}
						originIndex={5}
						delayPerPixel={delayPerPixel}
						originOffset={originOffset}
						{...{ element, pixel }}
						pixelMargin={pixelMargin}
					/>
				))}
			</motion.div>
		</Grid>
	)
}

const GridItem = ({
	delayPerPixel,
	i,
	originIndex,
	originOffset,
	element,
	pixel,
	pixelMargin,
}) => {
	/* This math.round creates the override of the grid by a few items,
	 * making it not 10x10 but e.g. 10x10 + 3 */

	const delayRef = useRef(0)
	const offset = useRef({ top: 0, left: 0 })
	const ref = useRef()

	useLayoutEffect(() => {
		const element = ref.current
		if (!element) return

		offset.current = {
			top: element.offsetTop,
			left: element.offsetLeft,
		}

		if (i === originIndex) {
			originOffset.current = offset.current
		}
	}, [delayPerPixel])

	useEffect(() => {
		const updateDelay = () => {
			const dx = Math.abs(offset.current.left - originOffset.current.left)
			const dy = Math.abs(offset.current.top - originOffset.current.top)
			const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
			delayRef.current = d * delayPerPixel
		}
		updateDelay()
	})

	return (
		<motion.li
			key={element.dottedName}
			title={`${element.title} (${element.topCategoryTitle})`}
			css={`
				background: ${element.topCategoryColor};
				border-radius: 0.6rem;
				margin: ${pixelMargin}rem;

				:hover {
					background: white;
					img {
						filter: none;
					}
				}
			`}
			ref={ref}
			variants={itemVariants}
			custom={delayRef}
		>
			<SafeCategoryImage element={element} />
		</motion.li>
	)
}

const itemVariants = {
	hidden: {
		opacity: 0,
		scale: 0.5,
	},
	visible: (delayRef) => ({
		opacity: 1,
		scale: 1,
		transition: { delay: delayRef.current },
	}),
}

const Grid = styled.ul`
	padding: 0;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	/* Black magic. This width needs .1 to accomodate for I don't know what*/
	width: ${(props) =>
		(props.gridLength / 10) * (props.pixelRemSize + props.pixelMargin * 2) +
		0.1}rem;
	margin: 0 auto;
	/* The grid will not be centered horizontally. This may be achieved via CSS grids, but it took me more than 15 minutes to not figure out how to do it
					 * Another interesting layout would be a snake layout, but it's not simple either :
					 * https://stackoverflow.com/questions/59481712/flexbox-reverse-direction-on-wrap-snake-wrap
					 * */

	li {
		list-style-type: none;
		width: ${(props) => props.pixelRemSize}rem;
		height: ${(props) => props.pixelRemSize}rem;
		box-shadow: #5758bb63 0px 0px 6px 0px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		line-height: 1.4rem;
		font-size: 90%;
		border-radius: 0;
	}
	li img {
		width: 2rem;
	}
`
