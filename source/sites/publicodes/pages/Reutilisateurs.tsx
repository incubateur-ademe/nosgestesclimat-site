import reutilisateurs from '../../../locales/reutilisateurs/fr/reutilisateurs.yaml'

const categories = Object.keys(reutilisateurs)

export default function Reutilisateurs() {
	return (
		<div className="container py-4 px-2 ">
			<h1>Nos réutilisateurs</h1>
			{categories.map((category) => (
				<div key={category} className="mb-4">
					<h2 className="mb-2">{category}</h2>
					<div className="grid grid-cols-4 gap-4">
						{reutilisateurs[category].map((reutilisateur) => (
							<div
								className="bg-grey-100 rounded-md mb-4 overflow-hidden"
								key={reutilisateur.title}
							>
								<img
									className="w-full"
									src={`/images/reutilisateurs/${reutilisateur.image}`}
									alt={reutilisateur.title}
								/>
								<p className="m-4 mt-2 mb-4">{reutilisateur.title}</p>
								{reutilisateur.link && (
									<a
										href={reutilisateur.link}
										target="_blank"
										className="block m-4 mt-0 text-sm"
									>
										{
											reutilisateur.link
												.replace('https://', '')
												.replace('www.', '')
												.split('/')[0]
										}
									</a>
								)}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
