/*
	This module contains all types and functions related to the translation.
*/

import faqFr from './faq/FAQ-fr.yaml'
import faqEn from './faq/FAQ-en-us.yaml'
import faqIt from './faq/FAQ-it.yaml'
import faqEs from './faq/FAQ-es.yaml'
import { i18n } from 'i18next'

export enum Lang {
	Default = 'Fr',
	Fr = 'Fr',
	En = 'En',
	Es = 'Es',
	It = 'It',
}

export type LangInfos = {
	name: string
	abrv: string
	faqContent: string // The FAQ content in YAML
}

export const defaultLang = Lang.Fr

export function getLangInfos(lang: Lang): LangInfos {
	switch (lang) {
		case Lang.Fr: {
			return {
				name: 'Français',
				abrv: 'fr',
				faqContent: faqFr,
			}
		}
		case Lang.En: {
			return {
				name: 'English',
				abrv: 'en',
				faqContent: faqEn,
			}
		}
		case Lang.Es: {
			return {
				name: 'Español',
				abrv: 'es',
				faqContent: faqEs,
			}
		}
		case Lang.It: {
			return {
				name: 'Italiano',
				abrv: 'it',
				faqContent: faqIt,
			}
		}
	}
}

export function getLangFromAbreviation(abrv: string): Lang {
	switch (abrv) {
		case 'fr':
			return Lang.Fr
		case 'en':
			return Lang.En
		case 'es':
			return Lang.Es
		case 'it':
			return Lang.It
		default:
			return Lang.Default
	}
}

export function changeLangTo(i18n: i18n, currentLangState: Lang) {
	const langInfos = getLangInfos(currentLangState)
	if (langInfos) {
		i18n.changeLanguage(langInfos.abrv)
	}
}
