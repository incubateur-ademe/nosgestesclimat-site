import StyledComponentsRegistry from '../lib/registry'

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="fr">
			<body>
				<header>
					<img src="/documentation/logo-publicodes.svg" />
					<h1>NGC documentation next gen ultra</h1>
				</header>
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
			</body>
		</html>
	)
}
