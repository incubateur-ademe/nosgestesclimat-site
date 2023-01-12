import Link from 'next/link'

export default async function Page() {
	return (
		<div>
			<h1>Bienvenue sur la super doc NGC</h1>
			Vous pouvez consulter en pages statiques <Link href="/aa">
				aa
			</Link> et <Link href="/bb">bb</Link>.
		</div>
	)
}
