import animate from 'Components/ui/animate'
import { useState, Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setStoredTrajets } from '../../../actions/actions'
import { motifList, freqList } from './dataHelp'
import ReadOnlyRow from './ReadOnlyRow'
import EditableRow from './EditableRow'
import KmForm from './KmForm'
import KmHelpButton from './KmHelpButton'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import './KmHelp.css'

export default function KmHelp({ setFinalValue, dottedName }) {
	const dispatch = useDispatch()
	const storedTrajets = useSelector((state) => state.storedTrajets)

	const [isOpen, setIsOpen] = useState(false)

	const [trajets, setTrajets] = useState(storedTrajets[dottedName] || [])

	const [sum, updateSum] = useState(0)

	const [editFormData, setEditFormData] = useState({
		motif: '',
		label: '',
		distance: 0,
		xfois: '',
		periode: '',
		personnes: 0,
	})

	const [editTrajetId, setEditTrajetId] = useState(null)

	useEffect(() => {
		updateSum(
			trajets
				.map((trajet) => {
					const period = freqList.find((f) => f.name === trajet.periode)
					const freqValue = period ? period.value * trajet.xfois : 0
					return (trajet.distance * 2 * freqValue) / trajet.personnes
				})
				.reduce((memo, elt) => {
					return memo + elt
				}, 0)
		)
	}, [trajets])

	const firstRender = useRef(true)

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}
		setFinalValue(Math.round(+sum))
		dispatch(setStoredTrajets(dottedName, trajets))
	}, [sum])

	const handleEditFormSubmit = (event) => {
		event.preventDefault()

		const editedTrajet = {
			id: editTrajetId,
			motif: editFormData.motif,
			label: editFormData.label,
			distance: editFormData.distance,
			xfois: editFormData.xfois,
			periode: editFormData.periode,
			personnes: editFormData.personnes,
		}

		const newTrajets = [...trajets]

		const index = trajets.findIndex((trajet) => trajet.id === editTrajetId)

		newTrajets[index] = editedTrajet

		setTrajets(newTrajets)
		setEditTrajetId(null)
	}

	return !isOpen ? (
		<div
			css={`
				text-align: right;
			`}
		>
			<KmHelpButton text="&nbsp; Aide à la saisie" setIsOpen={setIsOpen} />
		</div>
	) : (
		<animate.fromTop>
			<div
				className="ui__ card content"
				css={`
					margin-bottom: 1rem;
				`}
			>
				<div
					css={`
						text-align: right;
					`}
				>
					<button
						className="ui__ simple small button"
						onClick={() => setIsOpen(false)}
					>
						Fermer
					</button>
				</div>
				<KmForm trajets={trajets} setTrajets={setTrajets} />
				<div
					css={`
						overflow: auto;
						padding: 0rem 0.5rem 0rem 0.5rem;
					`}
				>
					<form onSubmit={handleEditFormSubmit}>
						<TableTrajets>
							<thead>
								<tr>
									<th scope="col">Motif</th>
									<th scope="col" css="width: 22%">
										Label
									</th>
									<th scope="col" css="width: 10%">
										"KM"
									</th>
									<th scope="col" css="width: 22%">
										Fréquence
									</th>
									<th
										scope="col"
										css="width: 10%; color: transparent; text-shadow: 0 0 0 white;"
									>
										👥
									</th>
									<th scope="col" css="width: 5.5rem">
										Modifier
									</th>
								</tr>
							</thead>
							{sum ? (
								<tbody>
									{trajets.map((trajet) => (
										<Fragment>
											{editTrajetId === trajet.id ? (
												<EditableRow
													editFormData={editFormData}
													setEditFormData={setEditFormData}
													setEditTrajetId={setEditTrajetId}
												/>
											) : (
												<ReadOnlyRow
													trajet={trajet}
													trajets={trajets}
													setEditFormData={setEditFormData}
													setEditTrajetId={setEditTrajetId}
													setTrajets={setTrajets}
												/>
											)}
										</Fragment>
									))}
									<td colspan="6">
										<span
											css={`
												display: flex;
												justify-content: right;
											`}
										>
											Mon total :{' '}
											<strong>&nbsp;{Math.round(+sum)} km&nbsp;</strong>
										</span>
									</td>
								</tbody>
							) : (
								<tbody>
									<td colspan="6">
										<div
											css={`
												display: flex;
												justify-content: center;
											`}
										>
											<MouvingArrow />
											&nbsp; C'est un exemple &nbsp;
											<MouvingArrow />
										</div>
									</td>
									<tr
										css={`
											opacity: 0.5;
											background-color: #e9f1ff;
										`}
									>
										<td>Loisirs</td>
										<td>Entrainement</td>
										<td>10</td>
										<td>1 fois par semaine</td>
										<td>1.5</td>
										<td>
											<button>✏️</button>
											<button>🗑</button>
										</td>
									</tr>
								</tbody>
							)}
						</TableTrajets>
					</form>
				</div>
			</div>
		</animate.fromTop>
	)
}

const MouvingArrow = () => (
	<motion.div
		animate={{
			y: [0, 0, 0, -3, 4, 0],
		}}
		transition={{
			duration: 1.5,
			delay: 1,
			repeat: Infinity,
			repeatDelay: 0,
		}}
	>
		⬇️
	</motion.div>
)

const TableTrajets = styled.table`
	font-family: 'Roboto', sans-serif;
	border-spacing: 0 1rem;
	border-collapse: separate;
	background: white;
	font-size: 85%;
	table-layout: fixed;
	width: 100%;
	min-width: 500px;

	td,
	th {
		padding: 0.2rem;
		text-align: center;
	}

	tr {
		border-radius: 1rem;
	}

	thead th {
		background: var(--color);
		font-weight: normal !important;
		text-transform: uppercase;
		letter-spacing: 0.03rem;
		color: #ffffff;
	}

	thead tr {
		height: 2rem;
	}

	tbody tr {
		height: 1.5rem;
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
		/* -moz-box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
		transform: scale(1);
		-webkit-transform: scale(1);
		-moz-transform: scale(1); */
	}

	th:first-child,
	td:first-child {
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}
	th:last-child,
	td:last-child {
		border-bottom-right-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}
`
