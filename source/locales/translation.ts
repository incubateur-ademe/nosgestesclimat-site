/*
	This module contains all types and functions related to the translation.
*/

export { Lang, LangInfos, getLangInfos }

enum Lang {
	Fr = 'Fr',
	En = 'En',
}

type LangInfos = {
	name: string
	abrv: string
	icon?: string
}

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
	}
}
