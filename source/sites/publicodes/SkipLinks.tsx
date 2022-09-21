import { LinkWithQuery } from 'Components/LinkWithQuery'
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
					<LinkWithQuery
						to="#mainContent"
						onClick={() => focusTarget('#mainContent')}
					>
						<Trans>Aller au contenu</Trans>
					</LinkWithQuery>
				</li>
				<li>
					<LinkWithQuery
						to="#mainNavigation"
						onClick={() => focusTarget('#mainNavigation')}
					>
						<Trans>Menu</Trans>
					</LinkWithQuery>
				</li>
				<li>
					<LinkWithQuery to="/à-propos">
						<Trans>À propos</Trans>
					</LinkWithQuery>
				</li>
			</ul>
		</nav>
	)
}
