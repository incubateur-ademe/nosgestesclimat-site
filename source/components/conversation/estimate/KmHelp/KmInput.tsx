import { useContext } from 'react'
import Input from '../../Input'
import { FormOpenStateContext } from '../contexts/FormOpenStateContext'

const KmInput = (props) => {
	const { isOpen } = useContext(FormOpenStateContext)
	return (
		<Input
			{...props}
			disabled={isOpen}
			showAnimation
			idDescription={'explicationResultatAideKm'}
			isDisabled={isOpen}
		/>
	)
}

export default KmInput
