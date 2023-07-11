import Button from '@/components/groupe/Button'
import { Group } from '@/types/groups'
import { useEffect, useRef, useState } from 'react'
import { Trans } from 'react-i18next'

export default function InviteBlock({ group }: { group: Group }) {
	const [isCopied, setIsCopied] = useState(false)

	const timeoutRef = useRef<NodeJS.Timeout>()

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const isShareDefined = typeof navigator !== 'undefined' && navigator.share

	const sharedURL = `${window.location.origin}/groupes/invitation?groupId=${group?._id}`

	const handleShare = async () => {
		// TODO: replace with new tracking event
		// trackEvent(getMatomoEventShareMobile(score))
		if (navigator.share) {
			await navigator.share({
				text: sharedURL,
				url: sharedURL,
				title: 'Rejoindre mon groupe',
			})
		}
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(sharedURL)
		setIsCopied(true)
		timeoutRef.current = setTimeout(() => setIsCopied(false), 3000)
	}

	if (group?.members?.length > 1) {
		return (
			<div className="bg-grey-100 rounded-md p-4 flex gap-1 items-center justify-between mt-4">
				<p className="mb-0">
					Invitez d'autres personnes à rejoindre votre groupe
				</p>
				<Button
					className="whitespace-nowrap w-[8rem] flex justify-center"
					onClick={isShareDefined ? handleShare : handleCopy}
					data-cypress-id="invite-button"
				>
					{isShareDefined && <Trans>Partager</Trans>}
					{!isShareDefined &&
						(isCopied ? <Trans>Copié !</Trans> : <Trans>Copier le lien</Trans>)}
				</Button>
			</div>
		)
	}

	return (
		<div className="bg-grey-100 rounded-md p-4 mt-4">
			<h2 className="mt-0 text-lg">
				<Trans>Vous êtes le premier 🥳</Trans>
			</h2>
			<p className="mb-4">
				<Trans>
					Partagez cette page à vos proches pour leur permettre de rejoindre
					votre groupe.
				</Trans>
			</p>
			<Button
				className="w-[8rem] flex justify-center"
				onClick={isShareDefined ? handleShare : handleCopy}
				data-cypress-id="invite-button"
			>
				{isShareDefined && <Trans>Partager</Trans>}
				{!isShareDefined &&
					(isCopied ? <Trans>Copié !</Trans> : <Trans>Copier le lien</Trans>)}
			</Button>
		</div>
	)
}
