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
				`}
			>
				<label title="motif">
					<SelectWrapper>
						<WrappedSelect
							className="ui__"
							css={`
								max-width: 10rem !important;
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
						</WrappedSelect>
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
						<WrappedInput
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
						<input
							className="ui__"
							css={`
								max-width: 2rem !important;
							`}
							name="xfois"
							onChange={handleAddFormChange}
							type="number"
							required
							placeholder="x"
						></input>
						<strong css="padding: 0.2rem"> fois par </strong>
						<WrappedSelect
							className="ui__"
							css={`
								max-width: 10rem !important;
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
						</WrappedSelect>
						<SelectSuffix>📅</SelectSuffix>
					</SelectWrapper>
				</label>
				<label title="personnes">
					<InputWrapper>
						<WrappedInput
							className="ui__"
							css={`
								width: 9.5rem !important;
							`}
							name="personnes"
							type="number"
							min="1"
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

const WrappedInput = styled.input`
	position: relative;
	padding: 0.3rem !important;
	margin-bottom: 0rem !important;
`

const InputSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.5rem 0rem 0rem !important;
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

const WrappedSelect = styled.select`
	appearance: none;
	padding-right: 1.5rem !important;
	background-image: url('https://upload.wikimedia.org/wikipedia/commons/c/c7/Antu-go-down-24.svg');
	background-repeat: no-repeat;
	background-position: calc(100% - 0.2rem) 0.55rem;
	background-size: 1rem;
`

const SelectSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.5rem 0rem 0.2rem;
`
