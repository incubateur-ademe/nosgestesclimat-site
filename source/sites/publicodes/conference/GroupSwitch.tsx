import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Meta from '../../../components/utils/Meta'
import Instructions from './Instructions'
import { generateRoomName } from './utils'

export default () => {
	const [newRoom, setNewRoom] = useState(generateRoomName())
	const { t } = useTranslation()

	return (
		<div>
			<Meta
				title={t('Mode groupe')}
				description={t(
					'Faites le test à plusieurs via le mode conférence ou sondage'
				)}
			/>
			<h1 data-cypress-id="group-title">{t('Mode groupe')}</h1>

			<Instructions {...{ newRoom, setNewRoom }} />
		</div>
	)
}
