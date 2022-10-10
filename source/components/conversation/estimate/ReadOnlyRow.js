import React from 'react'

export default function ReadOnlyRow({
	trajet,
	setEditFormData,
	setEditTrajetId,
	trajets,
	setTrajets,
	openmojiURL,
}) {
	const handleEditClick = (event, trajet) => {
		event.preventDefault()
		setEditTrajetId(trajet.id)

		const formValues = { ...trajet }

		setEditFormData(formValues)
	}

	const handleDeleteClick = (trajetId) => {
		const newTrajets = [...trajets]

		const index = trajets.findIndex((trajet) => trajet.id === trajetId)

		newTrajets.splice(index, 1)

		setTrajets(newTrajets)
	}

	return (
		<tr>
			<td>{trajet.motif}</td>
			<td>{trajet.label}</td>
			<td>{trajet.distance}</td>
			<td>
				{trajet.xfois} x / {trajet.periode}
			</td>
			<td>{trajet.personnes}</td>
			<td
				css={`
					> button {
						padding: 0.4rem;
					}
				`}
			>
				<button
					type="button"
					onClick={(event) => handleEditClick(event, trajet)}
				>
					<img src={openmojiURL('modifier')} css="width: 1.5rem" />
				</button>
				<button type="button" onClick={() => handleDeleteClick(trajet.id)}>
					<img src={openmojiURL('supprimer')} css="width: 1.5rem" />
				</button>
			</td>
		</tr>
	)
}
