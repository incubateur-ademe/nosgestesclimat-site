import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Modal from 'Components/Modal'

// Component used to display survey in Modal.
// First survey in September 2022 : https://github.com/datagir/nosgestesclimat-site/commit/a5d9ea23e0cf432bfc8919b75ff9dc8432c0ced4

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
						src=""
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
