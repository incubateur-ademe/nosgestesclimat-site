export default () => (
	<div>
		<p>
			Les personas nous permettront de prendre le parti d'une diversité
			d'utilisateurs quand ils voient notamment notre écran "passer à l'action".
		</p>
		<h2>Comment créer un persona ?</h2>
		<p>
			C'est dans le fichier{' '}
			<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/personas.yaml">
				personas.yaml
			</a>{' '}
			que ça se passe. On peut soit copier coller les données d'un autre persona
			et les modifier, soit en créer un de zéro depuis la simulation. Une fois
			la simulation satisfaisante, cliquer sur "Modifier mes réponses" puis
			taper Ctrl-C, ouvrir la console du navigateur (F12), copier le JSON
			affiché, le coller dans <a href="https://www.json2yaml.com">cet outil</a>{' '}
			pour générer un YAML, puis l'insérer dans personas.yaml.
		</p>

		<p>
			Pour les prénoms, on peut utiliser{' '}
			<a href="https://lorraine-hipseau.me">ce générateur</a>.
		</p>
	</div>
)
