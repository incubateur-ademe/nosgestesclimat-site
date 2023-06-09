import GroupItem from './GroupItem'

export default function GroupList({ groups, className = '' }) {
	return (
		<div className={`flex flex-col ${className}`}>
			{groups.map((group, index) => {
				return <GroupItem key={`group-item-${index}`} group={group} />
			})}
		</div>
	)
}
