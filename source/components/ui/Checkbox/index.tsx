import React from 'react'
import './index.css'

export default function Checkbox(
	props: React.ComponentProps<'input'> & { label?: string }
) {
	console.log(props)
	return (
		<>
			<input
				type="checkbox"
				className="ui__ checkbox-input"
				css={`
					position: absolute !important;
					width: 1px !important;
					height: 1px;
					padding: 0px;
					margin: -1px;
					overflow: hidden;
					clip: rect(0px, 0px, 0px, 0px);
					white-space: nowrap;
					border: 0px none;
				`}
				{...props}
			/>
			<label
				htmlFor={props.id}
				style={{ display: 'flex', alignItems: 'center' }}
			>
				<div className="ui__ checkbox">
					<svg width="1em" height="1em" viewBox="0 0 18 18">
						<path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
						<polyline points="3 11 8 14 14 5" />
					</svg>
				</div>
				{props.label && <span className="visually-hidden">{props.label}</span>}
			</label>
		</>
	)
}
