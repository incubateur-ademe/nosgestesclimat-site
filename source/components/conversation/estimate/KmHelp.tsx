import animate from 'Components/ui/animate'
import { nanoid } from 'nanoid'
import { composeP } from 'ramda'
import { useState, Fragment, useEffect } from 'react'
import { motifList, freqList } from './dataHelp'
import './KmHelp.css'
import ReadOnlyRow from './ReadOnlyRow'
import EditableRow from './EditableRow'

export default function KmHelp({ sum, updateSum }) {
	const [isOpen, setIsOpen] = useState(false)

	const [trajets, setTrajets] = useState([])

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

	return isOpen ? (
		<animate.fromTop>
			<div>
				<form id="box" onSubmit={handleAddFormSubmit}>
					<select className="item" name="motif" onChange={handleAddFormChange}>
						<option value="">---</option>
						{motifList.map((m) => (
							<option key={m.id} value={m.name}>
								{m.name}
							</option>
						))}
					</select>
					<input
						className="item"
						name="label"
						type="text"
						placeholder="Trajet (Optionnel)"
						onChange={handleAddFormChange}
					/>
					<input
						className="item"
						name="distance"
						type="number"
						required
						placeholder="Distance"
						onChange={handleAddFormChange}
					/>
					<select
						className="item"
						name="frequence"
						onChange={handleAddFormChange}
					>
						<option value="">---</option>
						{freqList.map((f) => (
							<option key={f.id} value={f.name}>
								{f.name}
							</option>
						))}
					</select>
					<input
						className="item"
						name="personnes"
						type="number"
						required
						placeholder="Nombre de personnes"
						onChange={handleAddFormChange}
					/>
					<button type="submit">Add</button>
				</form>
				<div id="table-scroll">
					<form onSubmit={handleEditFormSubmit}>
						<table>
							<thead>
								<tr>
									<th scope="col">Motif</th>
									<th scope="col">Label</th>
									<th scope="col">Distance (Aller seulement)</th>
									<th scope="col">Fréquence</th>
									<th scope="col">Nbre de personnes</th>
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
				<button onClick={() => setIsOpen(false)}>🧮 Close</button>
			</div>
		</animate.fromTop>
	) : (
		<button onClick={() => setIsOpen(true)}>🧮 Help !</button>
	)
}
