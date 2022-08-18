import {
	EngineProvider,
	SituationProvider,
	engineOptions,
} from 'Components/utils/EngineContext'
import {
	configSituationSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'

import Engine from 'publicodes'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useBranchData from 'Components/useBranchData'

const removeLoader = () => {
	// Remove loader
	var css = document.createElement('style')
	css.type = 'text/css'
	css.innerHTML = `
		#js {
				animation: appear 0.5s;
				opacity: 1;
		}
		#loading {
				display: none !important;
		}
    `
	document.body.appendChild(css)
}

export default ({ children }) => {
	const branchData = useBranchData()
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const setRules = (rules) => dispatch({ type: 'SET_RULES', rules })

	useEffect(() => {
		if (branchData.shouldUseLocalFiles) {
			// Rules are stored in nested yaml files
			const req = require.context(
				'../../nosgestesclimat/data/',
				true,
				/\.(yaml)$/
			)

			// Bigger rule explanations are stored in nested .md files
			const reqPlus = require.context(
				'raw-loader!../../nosgestesclimat/data/actions-plus/',
				true,
				/\.(md)$/
			)

			const plusDottedNames = Object.fromEntries(
				reqPlus
					.keys()
					.map((path) => [
						path.replace(/(\.\/|\.md)/g, ''),
						reqPlus(path).default,
					])
			)

			const reqGuide = require.context(
				'raw-loader!../../nosgestesclimat/data/guide-mode-groupe/',
				true,
				/\.(md)$/
			)

			const guideMdFiles = Object.fromEntries(
				reqGuide
					.keys()
					.map((path) => [
						path.replace(/(\.\/|\.md)/g, ''),
						reqGuide(path).default,
					])
			)

			const rules = req.keys().reduce((memo, key) => {
				const jsonRuleSet = req(key).default || {}
				const ruleSetPlus = Object.fromEntries(
					Object.entries(jsonRuleSet).map(([k, v]) =>
						plusDottedNames[k]
							? [k, { ...v, plus: plusDottedNames[k] }]
							: [k, v]
					)
				)
				// we add guide files in rules
				ruleSetPlus['guide-mode-groupe'] = guideMdFiles
				return { ...memo, ...ruleSetPlus }
			}, {})

			setRules(rules)
			removeLoader()
		} else {
			fetch(branchData.deployURL + '/co2.json', { mode: 'cors' })
				.then((response) => response.json())
				.then((json) => {
					setRules(json)
					removeLoader()
				})
		}
	}, [])

	if (!rules) return null
	return <EngineWrapper rules={rules}>{children}</EngineWrapper>
}

const EngineWrapper = ({ rules, children }) => {
	const engine = useMemo(
			() => new Engine(rules, engineOptions),
			[rules, engineOptions]
		),
		userSituation = useSelector(situationSelector),
		configSituation = useSelector(configSituationSelector),
		situation = useMemo(
			() => ({
				...configSituation,
				...userSituation,
			}),
			[configSituation, userSituation]
		)

	return (
		<EngineProvider value={engine}>
			<SituationProvider situation={situation}>{children}</SituationProvider>
		</EngineProvider>
	)
}
