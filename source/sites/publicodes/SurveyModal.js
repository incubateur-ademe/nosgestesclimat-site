import React, { useContext } from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import Modal from 'Components/Modal'

export default function SurveyModal() {
	const [showSurveyModal, setShowSurveyModal] = useState(false)
	return (
		<div>
			<button
				className="ui__ link-button"
				onClick={() => setShowSurveyModal(true)}
				css={`
					margin-top: 1rem;
				`}
			>
				Participez à notre enquête utilisateurs !
			</button>
			<Modal
				open={showSurveyModal}
				setOpen={setShowSurveyModal}
				children={
					<iframe
						title="enquete"
						src="https://airtable.com/embed/shrC3ZoGYUCmwLpnf?backgroundColor=teal"
						frameBorder="0"
						width="100%"
						height="533"
					></iframe>
				}
			/>
		</div>
	)
}
