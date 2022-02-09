import React from 'react'
import styled from 'styled-components'
import { QueryClient, QueryClientProvider } from 'react-query'

import NGC from 'Components/stats/NGC'
import Applications from 'Components/stats/Applications'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	},
})

const Title = styled.h1`
	font-size: 5.5rem;
	text-align: center;
`
export default function Dashboard(props) {
	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<Title>Statistiques</Title>
				<Applications />
			</div>
		</QueryClientProvider>
	)
}
