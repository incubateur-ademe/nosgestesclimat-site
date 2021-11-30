import React from 'react'

export default function ReadOnlyRow({
	trajet,
	handleEditClick,
	handleDeleteClick,
}) {
	return (
		<tr>
			<td>{trajet.motif}</td>
			<td>{trajet.label}</td>
			<td>{trajet.distance}</td>
			<td>{trajet.frequence}</td>
			<td>{trajet.personnes}</td>
			<td>
				<button
					type="button"
					onClick={(event) => handleEditClick(event, trajet)}
				>
					✏️
				</button>
				<button type="button" onClick={() => handleDeleteClick(trajet.id)}>
					🗑
				</button>
			</td>
		</tr>
	)
}
