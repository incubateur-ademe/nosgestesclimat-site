import { Link } from 'Components/Link'
import { Trans } from 'react-i18next'

const DocumentationButton = (props) => {
	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					margin-right: 0.4rem !important;
				}
			`}
		>
			<Link {...props} to={'/documentation'}>
				<Trans>Documentation</Trans>
			</Link>
		</div>
	)
}

export default DocumentationButton
