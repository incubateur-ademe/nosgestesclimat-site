export default function useCurrentRegionCode() {
	return supportedRegion(localisation?.country?.code)
		? localisation?.country?.code
		: defaultModel
}
