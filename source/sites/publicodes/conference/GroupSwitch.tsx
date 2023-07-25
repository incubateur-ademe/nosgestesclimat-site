import Title from '@/components/groupe/Title'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
			<Title data-cypress-id="group-title" title={t('Mode groupe')} />
			<ScrollToTop />
			<Instructions {...{ newRoom, setNewRoom }} />
		</div>
	)
}
