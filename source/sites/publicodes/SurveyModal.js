import React, { useContext } from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import Modal from 'Components/Modal'

export default function SurveyModal({ showSurveyModal, setShowSurveyModal }) {
	return (
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
	)
}
