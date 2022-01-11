import { createClient } from '@supabase/supabase-js'
import { useMemo } from 'react'
export default () => {
	const supabase = useMemo(
		() => createClient(SUPABASE_URL, SUPABASE_ANON_KEY),
		[]
	)

	return supabase
}
