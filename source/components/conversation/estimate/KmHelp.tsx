import animate from 'Components/ui/animate'
import { nanoid } from 'nanoid'
import { composeP } from 'ramda'
import { useState } from 'react'
import { motifList, freqList } from './dataHelp'
import './KmHelp.css'

export default function KmHelp({ sum, updateSum }) {
	const [isOpen, setIsOpen] = useState(false)

	const [trajets, setTrajets] = useState([
		{
			motif: 'Exemple',
			label: 'Mon trajet',
			distance: 60,
			fréquence: '1 fois par semaine',
			personnes: 3,
		},
		{
			motif: 'Exemple',
			label: 'Mon trajet',
			distance: 60,
			fréquence: '1 fois par an',
			personnes: 2,
		},
	])

	const [addFormData, setAddFormData] = useState({
		motif: '',
		label: '',
		distance: 0,
		fréquence: '',
		personnes: 0,
	})

	const handleAddFormChange = (event) => {
		event.preventDefault()

		const fieldName = event.target.getAttribute('name')
		const fieldValue = event.target.value

		const newFormData = { ...addFormData }
		newFormData[fieldName] = fieldValue

		setAddFormData(newFormData)
	}

	const handleAddFormSubmit = (event) => {
		event.preventDefault()

		const newTrajet = {
			id: nanoid(),
			motif: addFormData.motif,
			label: addFormData.label,
			distance: addFormData.distance,
			fréquence: addFormData.fréquence,
			personnes: addFormData.personnes,
		}

		const newTrajets = [...trajets, newTrajet]
		setTrajets(newTrajets)
	}

	const calculateSum = () => {
		const trajetsActualisés = trajets.map((trajet) => {
			const freq = freqList.find((f) => f.name === trajet.fréquence)
			const freqValue = freq ? freq.value : 0
			return (trajet.distance * freqValue) / trajet.personnes
		})
		const newSum = trajetsActualisés.reduce((memo, elt) => {
			return memo + elt
		}, 0)
		updateSum(newSum)
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
						name="fréquence"
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
					<button type="submit" onClick={() => calculateSum()}>
						Add
					</button>
				</form>
				<div id="table-scroll">
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
								<tr>
									<td>{trajet.motif}</td>
									<td>{trajet.label}</td>
									<td>{trajet.distance}</td>
									<td>{trajet.fréquence}</td>
									<td>{trajet.personnes}</td>
									<td>✏️</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div>{sum}</div>
				<button onClick={() => setIsOpen(false)}>🧮 Close</button>
			</div>
		</animate.fromTop>
	) : (
		<button onClick={() => setIsOpen(true)}>🧮 Help !</button>
	)
}
