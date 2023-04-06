import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from 'react'

type ContextType = {
	isOpen: boolean
	setIsFormOpen: Dispatch<SetStateAction<boolean>>
}
export const FormOpenStateContext = createContext<ContextType>({
	isOpen: false,
	setIsFormOpen: () => {},
})

export const FormOpenStateProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const [isOpenState, setIsOpenState] = useState(false)
	return (
		<FormOpenStateContext.Provider
			value={{
				isOpen: isOpenState,
				setIsFormOpen: setIsOpenState,
			}}
		>
			{children}
		</FormOpenStateContext.Provider>
	)
}
