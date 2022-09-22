import { Link } from 'Components/Link'
import { Trans } from 'react-i18next'

export default () => {
	const focusTarget = (focusTarget) => {
		const target = document.querySelector(focusTarget)
		target.focus()
	}

	return (
		<nav
			aria-label="Accès rapide"
			tabIndex="0"
			css={`
				position: absolute;
				transform: translateX(-2000%);
				transition: transform 0.3s;

				:focus,
				:focus-within {
					position: static;
					transform: translateX(0);
				}
			`}
		>
			<ul>
				<li>
					<Link
						to="#mainContent"
						onClick={() => focusTarget('#mainContent')}
					>
						<Trans>Aller au contenu</Trans>
					</Link>
				</li>
				<li>
					<Link
						to="#mainNavigation"
						onClick={() => focusTarget('#mainNavigation')}
					>
						<Trans>Menu</Trans>
					</Link>
				</li>
				<li>
					<Link to="/à-propos">
						<Trans>À propos</Trans>
					</Link>
				</li>
			</ul>
		</nav>
	)
}
