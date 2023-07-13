import { useTranslation } from 'react-i18next'
import TextInputGroup from './TextInputGroup'

export default function EmailInput({
	email,
	setEmail,
	errorEmail,
	setErrorEmail,
	...props
}) {
	const { t } = useTranslation()

	return (
		<TextInputGroup
			label={
				<span>
					{t('Votre adresse email')}{' '}
					<span className="text-secondary italic"> {t('facultatif')}</span>
				</span>
			}
			helperText={t(
				'Seulement pour vous permettre de retrouver votre groupe ou de supprimer vos données'
			)}
			name="prenom"
			placeholder="jean-marc@nosgestesclimat.fr"
			className="mt-6 mb-6"
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
				setEmail(e.target.value)
				if (errorEmail) {
					setErrorEmail('')
				}
			}}
			value={email}
			error={errorEmail}
			{...props}
		/>
	)
}
