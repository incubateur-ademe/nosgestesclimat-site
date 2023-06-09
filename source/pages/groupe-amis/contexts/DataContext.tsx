import { createContext, Dispatch, SetStateAction, useState } from 'react'

type DataContextType = {
	prenom: string
	setPrenom: Dispatch<SetStateAction<string>>
	email: string
	setEmail: Dispatch<SetStateAction<string>>
	groupeName: string
	setGroupeName: Dispatch<SetStateAction<string>>
}

export const DataContext = createContext<DataContextType>({
	prenom: '',
	setPrenom: () => {},
	email: '',
	setEmail: () => {},
	groupeName: '',
	setGroupeName: () => {},
})

export const DataProvider = ({ children }) => {
	const [prenom, setPrenom] = useState('')
	const [email, setEmail] = useState('')
	const [groupeName, setGroupeName] = useState('')

	return (
		<DataContext.Provider
			value={{
				prenom,
				setPrenom,
				email,
				setEmail,
				groupeName,
				setGroupeName,
			}}
		>
			{children}
		</DataContext.Provider>
	)
}
