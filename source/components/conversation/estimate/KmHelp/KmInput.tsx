import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Input from '../../Input'

const helperId = 'km-helper-id'

const KmInput = (props) => {
	const { t } = useTranslation()
	const { isFormOpen } = props
	return (
		<>
			<Input
				{...props}
				showAnimation
				idDescription={helperId}
				isDisabled={isFormOpen}
				aria-describedby={helperId}
			/>
			{isFormOpen && (
				<StyledSpan aria-hidden={!isFormOpen} id={helperId}>
					{t(
						'Champ désactivé durant le remplissage du détail ; se mettra à jour automatiquement.'
					)}
				</StyledSpan>
			)}
		</>
	)
}

const StyledSpan = styled.span`
	text-align: right;
	font-size: 0.75rem;
	display: block;
	margin-top: -0.25rem;
	margin-bottom: 0.5rem;
	line-height: 1.5;
`

export default KmInput
