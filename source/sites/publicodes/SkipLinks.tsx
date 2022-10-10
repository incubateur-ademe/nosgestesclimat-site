import { Link } from 'react-router-dom'
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
					<Link to="#mainContent" onClick={() => focusTarget('#mainContent')}>
						Aller au contenu
					</Link>
				</li>
				<li>
					<Link
						to="#mainNavigation"
						onClick={() => focusTarget('#mainNavigation')}
					>
						Menu
					</Link>
				</li>
				<li>
					<Link to="/à-propos">À propos</Link>
				</li>
			</ul>
		</nav>
	)
}
