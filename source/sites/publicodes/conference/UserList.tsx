import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { findContrastedTextColor } from '../../../components/utils/colors'

export const UserList = ({ users, username, extremes }) => (
	<ul
		css={`
			display: flex;
			list-style-type: none;
			flex-wrap: wrap;
			li {
				margin: 0.6rem;
			}
		`}
	>
		{users.map((u) => (
			<li
				key={u.name}
				css={`
					background: ${u.color};
					color: ${findContrastedTextColor(u.color, true)};
					padding: 0.1rem 0.4rem;
					border-radius: 0.6rem;
				`}
			>
				{extremes.find(([key, _]) => key === u.name) && (
					<span>{emoji('⚠️ ')}</span>
				)}
				{u.name}
				{u.name === username && ' (toi)'}
			</li>
		))}
	</ul>
)

export const UserBlock = ({ extremes, users, username }) => {
	const uniqueUsers = getUniqueUsers(users)
	const { t } = useTranslation()

	return (
		<div>
			<h2 css="display: inline-block ;margin-right: 1rem">
				<Trans>👤 Qui est connecté ?</Trans>
			</h2>
			<span role="status" css="color: #397540; font-weight: bold">
				{emoji('🟢')} {uniqueUsers.length} {t('participant')}
				{plural(uniqueUsers)}
			</span>
			<UserList users={uniqueUsers} username={username} extremes={extremes} />
			{extremes.length > 0 && (
				<div>
					<Trans>⚠️ Certains utilisateurs ont des bilans extrêmes.</Trans>
				</div>
			)}
		</div>
	)
}
const plural = (list) => (list.length > 1 ? 's' : '')

const getUniqueUsers = (array) =>
	array.filter(
		(value, index, self) =>
			index ===
			self.findIndex(
				(elt) => elt.name === value.name && elt.color === value.color
			)
	)
