import styled from 'styled-components'
import { useState } from 'react'
import { motifList, freqList } from './dataHelp'
import { nanoid } from 'nanoid'

export default function KmForm({ trajets, setTrajets }) {
	const [addFormData, setAddFormData] = useState({
		motif: '',
		label: '',
		distance: 0,
		xfois: '',
		periode: '',
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
			xfois: addFormData.xfois,
			periode: addFormData.periode,
			personnes: addFormData.personnes,
		}

		const newTrajets = [...trajets, newTrajet]
		setTrajets(newTrajets)
	}
	return (
		<form
			onSubmit={handleAddFormSubmit}
			css={`
				padding: 0rem 0.5rem 0rem 0.5rem;
			`}
		>
			<div
				css={`
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					gap: 0.5rem;
					margin-top: 0.5rem;
					padding: 0rem 0.5rem 0rem 0.5rem;
					input,
					select {
						height: 2rem;
						border: none !important;
						outline: none !important;
					}
					select {
						appearance: none;
					}
				`}
			>
				<label title="motif">
					<SelectWrapper>
						<select
							className="ui__"
							css={`
								max-width: 9rem !important;
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
					</SelectWrapper>
				</label>
				<label title="label">
					<InputWrapper>
						<input
							className="ui__"
							css={`
								width: 8rem !important;
							`}
							name="label"
							type="text"
							placeholder="Label (facultatif)"
							onChange={handleAddFormChange}
						/>
					</InputWrapper>
				</label>
				<label title="distance">
					<InputWrapper>
						<InputSuffixed
							className="ui__"
							css={`
								width: 8rem !important;
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
					<SelectWrapper>
						<select
							className="ui__"
							css={`
								max-width: 10rem !important;
								outline: none !important;
								border: none !important;
							`}
							name="xfois"
							onChange={handleAddFormChange}
							required
						>
							<option value="">x</option>
							{Array.from({ length: 9 }, (_, i) => i + 1).map((v) => (
								<option key={v} value={v}>
									{v}
								</option>
							))}
						</select>
						<strong css="padding: 0.2rem"> fois par </strong>
						<select
							className="ui__"
							css={`
								max-width: 10rem !important;
								outline: none !important;
								border: none !important;
							`}
							name="periode"
							onChange={handleAddFormChange}
							required
						>
							<option value="">période</option>
							{freqList.map((f) => (
								<option key={f.id} value={f.name}>
									{f.name}
								</option>
							))}
						</select>
					</SelectWrapper>
				</label>
				<label title="personnes">
					<InputWrapper>
						<InputSuffixed
							className="ui__"
							css={`
								width: 9.5rem !important;
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
			</div>
			<div
				css={`
					text-align: right;
				`}
			>
				<button
					className="ui__ plain small button"
					css="max-height: 2rem"
					type="submit"
				>
					Ajouter
				</button>
			</div>
		</form>
	)
}

const InputWrapper = styled.span`
	display: flex;
	margin: 0rem 0.4rem 0.6rem 0rem;
	background-color: white;
	color: inherit;
	font-size: inherit;
	transition: border-color 0.1s;
	position: relative;
	font-family: inherit;
	height: 2.2rem;
	border: 1px solid var(--lighterTextColor);
	border-radius: 0.3rem;
	&:focus {
		outline: 1px solid var(--color);
	}
`

const InputSuffixed = styled.input`
	position: relative;
	padding: 0.3rem !important;
	margin-bottom: 0rem !important;
`

const InputSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.3rem 0rem 0rem;
`

const SelectWrapper = styled.span`
	display: flex;
	margin: 0rem 0.4rem 0.6rem 0rem;
	background-color: white;
	color: inherit;
	font-size: inherit;
	transition: border-color 0.1s;
	position: relative;
	font-family: inherit;
	height: 2.2rem;
	border: 1px solid var(--lighterTextColor);
	border-radius: 0.3rem;
	&:focus {
		box-shadow: 0px 0.25rem 0px 0px solid var(--color);
	}
`
