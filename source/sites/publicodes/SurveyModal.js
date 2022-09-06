import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Modal from 'Components/Modal'

export default function SurveyModal({ showSurveyModal, setShowSurveyModal }) {
	const [loading, setLoading] = useState(true)
	return (
		<Modal
			open={showSurveyModal}
			setOpen={setShowSurveyModal}
			children={
				<div>
					{loading && (
						<div
							css={`
								align-items: center;
								display: flex;
								justify-content: center;
							`}
						>
							Chargement
						</div>
					)}
					<iframe
						title="enquete"
						src="https://airtable.com/embed/shrC3ZoGYUCmwLpnf?backgroundColor=teal"
						frameBorder="0"
						width="100%"
						height="533"
						onLoad={() => setLoading(false)}
					></iframe>
				</div>
			}
		/>
	)
}
