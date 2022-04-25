import useMediaQuery from 'Components/utils/useMediaQuery'
import Chart from './chart/index.js'
import InlineCategoryChart from './chart/InlineCategoryChart'
export default () => {
	const matches = useMediaQuery('(min-height: 800px)')
	return matches ? <Chart /> : <InlineCategoryChart />
}
