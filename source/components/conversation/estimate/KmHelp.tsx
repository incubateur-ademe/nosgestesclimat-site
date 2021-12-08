import animate from 'Components/ui/animate'
import { nanoid } from 'nanoid'
import { composeP } from 'ramda'
import { useState, Fragment, useEffect } from 'react'
import { motifList, freqList } from './dataHelp'
import ReadOnlyRow from './ReadOnlyRow'
import EditableRow from './EditableRow'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import './KmHelp.css'

export default function KmHelp({ setFinalValue }) {
	const [isOpen, setIsOpen] = useState(false)

	const [trajets, setTrajets] = useState([])

	const [sum, updateSum] = useState(0)

	const [addFormData, setAddFormData] = useState({
		motif: '',
		label: '',
		distance: 0,
		frequence: '',
		personnes: 0,
	})

	const [editFormData, setEditFormData] = useState({
		motif: '',
		label: '',
		distance: 0,
		frequence: '',
		personnes: 0,
	})

	const [editTrajetId, setEditTrajetId] = useState(null)

	useEffect(() => {
		updateSum(
			trajets
				.map((trajet) => {
					const freq = freqList.find((f) => f.name === trajet.frequence)
					const freqValue = freq ? freq.value : 0
					return (trajet.distance * 2 * freqValue) / trajet.personnes
				})
				.reduce((memo, elt) => {
					return memo + elt
				}, 0)
		)
	}, [trajets])

	useEffect(() => {
		if (sum) setFinalValue(Math.round(+sum))
	}, [sum])

	// useEffect(() => {
	// 	updateSum(
	// 		trajets
	// 			.map((trajet) => {
	// 				const freq = freqList.find((f) => f.name === trajet.frequence)
	// 				const freqValue = freq ? freq.value : 0
	// 				return (trajet.distance * 2 * freqValue) / trajet.personnes
	// 			})
	// 			.reduce((memo, elt) => {
	// 				return memo + elt
	// 			}, 0)
	// 	)
	// }, [{sum}])

	const handleAddFormChange = (event) => {
		event.preventDefault()

		const fieldName = event.target.getAttribute('name')
		const fieldValue = event.target.value

		const newFormData = { ...addFormData }
		newFormData[fieldName] = fieldValue

		setAddFormData(newFormData)
	}

	const handleEditFormChange = (event) => {
		event.preventDefault()

		const fieldName = event.target.getAttribute('name')
		const fieldValue = event.target.value

		const newFormData = { ...editFormData }
		newFormData[fieldName] = fieldValue

		setEditFormData(newFormData)
	}

	const handleAddFormSubmit = (event) => {
		event.preventDefault()

		const newTrajet = {
			id: nanoid(),
			motif: addFormData.motif,
			label: addFormData.label,
			distance: addFormData.distance,
			frequence: addFormData.frequence,
			personnes: addFormData.personnes,
		}

		const newTrajets = [...trajets, newTrajet]
		setTrajets(newTrajets)
	}

	const handleEditFormSubmit = (event) => {
		event.preventDefault()

		const editedTrajet = {
			id: editTrajetId,
			motif: editFormData.motif,
			label: editFormData.label,
			distance: editFormData.distance,
			frequence: editFormData.frequence,
			personnes: editFormData.personnes,
		}

		const newTrajets = [...trajets]

		const index = trajets.findIndex((trajet) => trajet.id === editTrajetId)

		newTrajets[index] = editedTrajet

		setTrajets(newTrajets)
		setEditTrajetId(null)
	}

	const handleEditClick = (event, trajet) => {
		event.preventDefault()
		setEditTrajetId(trajet.id)

		const formValues = {
			motif: trajet.motif,
			label: trajet.label,
			distance: trajet.distance,
			frequence: trajet.frequence,
			personnes: trajet.personnes,
		}

		setEditFormData(formValues)
	}

	const handleCancelClick = () => {
		setEditTrajetId(null)
	}

	const handleDeleteClick = (trajetId) => {
		const newTrajets = [...trajets]

		const index = trajets.findIndex((trajet) => trajet.id === trajetId)

		newTrajets.splice(index, 1)

		setTrajets(newTrajets)
	}

	return !isOpen ? (
		<div
			css={`
				text-align: right;
			`}
		>
			<HelpButton text="&nbsp; Aide à la saisie" setIsOpen={setIsOpen} />
		</div>
	) : (
		<animate.fromTop>
			<div className="ui__ card content" css="margin-bottom: 1rem">
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
				<form
					css={`
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						gap: 0.5rem;
					`}
					onSubmit={handleAddFormSubmit}
				>
					<label title="motif">
						<select
							className="ui__"
							css={`
								max-width: 10rem !important;
								max-height: 2rem;
							`}
							name="motif"
							onChange={handleAddFormChange}
							required
						>
							<option value="">Motif</option>
							{motifList.map((m) => (
								<option key={m.id} value={m.name}>
									{m.name}
								</option>
							))}
						</select>
					</label>
					<label title="label">
						<input
							className="ui__"
							css={`
								width: 9rem !important;
								max-height: 2rem;
							`}
							name="label"
							type="text"
							placeholder="Label (Optionnel)"
							onChange={handleAddFormChange}
						/>
					</label>
					<label title="distance">
						<InputWrapper>
							<InputSuffixed
								className="ui__"
								css={`
									width: 3rem !important;
								`}
								name="distance"
								type="number"
								required
								placeholder="Distance (Aller)"
								onChange={handleAddFormChange}
							/>
							<InputSuffix>km</InputSuffix>
						</InputWrapper>
					</label>
					<label title="frequence">
						<select
							className="ui__"
							css={`
								max-width: 10rem !important;
								max-height: 2rem;
							`}
							name="frequence"
							onChange={handleAddFormChange}
							required
						>
							<option value="">Fréquence</option>
							{freqList.map((f) => (
								<option key={f.id} value={f.name}>
									{f.name}
								</option>
							))}
						</select>
					</label>
					<label title="personnes">
						<InputWrapper>
							<InputSuffixed
								className="ui__"
								css={`
									width: 3rem !important;
								`}
								name="personnes"
								type="number"
								required
								placeholder="Nbre de personnes"
								onChange={handleAddFormChange}
							/>
							<InputSuffix>👥</InputSuffix>
						</InputWrapper>
					</label>
					<button
						className="ui__ plain small button"
						css="max-height: 2rem"
						type="submit"
					>
						Add
					</button>
				</form>
				<div
					css={`
						overflow: auto;
						margin-top: 20px;
						padding: 0rem 0.5rem 0rem 0.5rem;
					`}
				>
					<form onSubmit={handleEditFormSubmit}>
						<table
							css={`
								font-family: 'Roboto', sans-serif;
								border-spacing: 0 1rem;
								border-collapse: separate;
								background: white;
								width: 100%;
								font-size: 1rem;

								td,
								th {
									padding: 0.5rem;
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
									box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.1);
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
							`}
						>
							<thead>
								<tr>
									<th scope="col">Motif</th>
									<th scope="col">Label</th>
									<th scope="col">Distance (Aller)</th>
									<th scope="col">Fréquence</th>
									<th scope="col">Nbre de personnes</th>
									<th scope="col">Modifier</th>
								</tr>
							</thead>
							<tbody>
								{trajets.map((trajet) => (
									<Fragment>
										{editTrajetId === trajet.id ? (
											<EditableRow
												editFormData={editFormData}
												handleEditFormChange={handleEditFormChange}
												handleCancelClick={handleCancelClick}
											/>
										) : (
											<ReadOnlyRow
												trajet={trajet}
												handleEditClick={handleEditClick}
												handleDeleteClick={handleDeleteClick}
											/>
										)}
									</Fragment>
								))}
							</tbody>
						</table>
					</form>
				</div>
			</div>
		</animate.fromTop>
	)
}

const HelpButton = ({ text, setIsOpen }) => (
	<button
		className="ui__ plain small button"
		css="margin-bottom: 0.5rem"
		onClick={() => setIsOpen(true)}
	>
		<div
			css={`
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
			`}
		>
			<motion.div
				animate={{
					rotate: [0, 15, -15, 0],
					y: [0, 0, 0, -3, 4, 3],
				}}
				transition={{
					duration: 1.5,
					delay: 1,
					repeat: Infinity,
					repeatDelay: 2,
				}}
			>
				✏️
			</motion.div>
			{text}
		</div>
	</button>
)

const InputWrapper = styled.div`
	display: flex;
	max-width: 100%;
	margin-bottom: 0.6rem;
	border: 1px solid var(--lighterTextColor);
	border-radius: 0.3rem;
	background-color: white;
	color: inherit;
	font-size: inherit;
	transition: border-color 0.1s;
	position: relative;
	font-family: inherit;
	max-height: 2rem;
	&:focus {
		outline: 1px solid var(--color);
	}
`

const InputSuffixed = styled.input`
	border: none !important;
	outline: none !important;
	position: relative;
	padding: 0.3rem !important;
	margin-bottom: 0rem !important;
`

const InputSuffix = styled.div`
	position: relative;
	padding: 0.1rem 0.5rem 0rem 0rem;
`
