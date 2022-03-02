import React from 'react'
import styled from 'styled-components'
import { QueryClient, QueryClientProvider } from 'react-query'

import StatsContent from 'Components/stats/StatsContent'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	},
})

export default function Dashboard(props) {
	return (
		<QueryClientProvider client={queryClient}>
			<StatsContent />
		</QueryClientProvider>
	)
}
