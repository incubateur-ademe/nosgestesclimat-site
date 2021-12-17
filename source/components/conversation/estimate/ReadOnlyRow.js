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
					✏️
				</button>
				<button type="button" onClick={() => handleDeleteClick(trajet.id)}>
					🗑
				</button>
			</td>
		</tr>
	)
}
