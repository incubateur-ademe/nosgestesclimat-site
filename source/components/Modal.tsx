import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
	position: fixed;
	z-index: 900;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: translate3d(0, 0, 1em);
	pointer-events: ${(props) => (props.open ? 'inherit' : 'none')};
`
const Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, ${(props) => (props.open ? 0.6 : 0)});
	transition: background-color ${(props) => (props.open ? '300ms' : '1ms')}
		ease-in-out;
`
const Content = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 40%;
	max-width: 90vw;
	max-height: 90vh;
	margin: 1rem;
	background-color: white;
	border-radius: 1em;
	box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.2);
	visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
	opacity: ${(props) => (props.open ? 1 : 0)};
	transform: scale(${(props) => (props.open ? 1 : 0.7)})
		translateY(${(props) => (props.open ? 0 : '10em')});
	transition: all
		${(props) => (props.open && !props.noAnimation ? '300ms' : '1ms')}
		ease-in-out;
`
const ButtonClose = styled.div`
	position: absolute;
	z-index: 12;
	top: 0.5em;
	right: 0.5em;
	font-size: 2rem;
	font-weight: bold;
	transform: rotate(45deg);
	cursor: pointer;
	line-height: 0.5;
`
const Scroll = styled.div`
	overflow-y: auto;
	padding: 0.5rem;
`
export default function Modal({ open, setOpen, children }) {
	return (
		<Wrapper open={open}>
			<Background open={open} onClick={() => setOpen(false)} />
			<Content open={open}>
				<ButtonClose onClick={() => setOpen(false)}>+</ButtonClose>
				<Scroll>{children}</Scroll>
			</Content>
		</Wrapper>
	)
}
