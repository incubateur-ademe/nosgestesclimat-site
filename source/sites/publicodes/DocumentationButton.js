import { LinkWithQuery } from 'Components/LinkWithQuery'
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
			<LinkWithQuery {...props} to={'/documentation'}>
				<Trans>Documentation</Trans>
			</LinkWithQuery>
		</div>
	)
}

export default DocumentationButton
