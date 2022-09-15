/*
	This module contains all types and functions related to the translation.
*/

export { Lang, LangInfos, getLangInfos, defaultLang }

enum Lang {
	Default = 'Fr',
	Fr = 'Fr',
	En = 'En',
	Es = 'Es',
	It = 'It',
}

type LangInfos = {
	name: string
	abrv: string
	icon?: string
}

const defaultLang = Lang.Fr

function getLangInfos(lang: Lang): LangInfos {
	switch (lang) {
		case Lang.Fr: {
			return {
				name: 'Français',
				abrv: 'fr',
			}
		}
		case Lang.En: {
			return {
				name: 'English',
				abrv: 'en',
			}
		}
		case Lang.Es: {
			return {
				name: 'Español',
				abrv: 'es',
			}
		}
		case Lang.It: {
			return {
				name: 'Italiano',
				abrv: 'it',
			}
		}
	}
}
