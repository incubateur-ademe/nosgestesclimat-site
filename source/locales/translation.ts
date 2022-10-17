/*
	This module contains all types and functions related to the translation.
*/

import { i18n } from 'i18next'

import uiEn from './ui/ui-en-us-min.yaml'
import uiEs from './ui/ui-es-min.yaml'
import uiFr from './ui/ui-fr-min.yaml'
import uiIt from './ui/ui-it-min.yaml'

import faqEn from './faq/FAQ-en-us-min.yaml'
import faqEs from './faq/FAQ-es-min.yaml'
import faqFr from './faq/FAQ-fr-min.yaml'
import faqIt from './faq/FAQ-it-min.yaml'

import releasesEn from './releases/releases-en-us.json'
import releasesEs from './releases/releases-es.json'
import releasesFr from './releases/releases-fr.json'
import releasesIt from './releases/releases-it.json'

export enum Lang {
	Default = 'Fr',
	Fr = 'Fr',
	En = 'En',
	Es = 'Es',
	It = 'It',
}

export type Release = {
	name: string
	published_at: string
	body: string
}

export type LangInfos = {
	name: string
	abrv: string
	abrvLocale: string
	faqContent: string // The FAQ content in YAML
	releases: Release[] // The releases content in JSON
	uiTrad: any // The UI translation in YAML
}

export const defaultLang = Lang.Fr

export function getLangInfos(lang: Lang): LangInfos {
	switch (lang) {
		case Lang.Fr: {
			return {
				name: 'Français',
				abrv: 'fr',
				abrvLocale: 'fr-FR',
				faqContent: faqFr,
				releases: releasesFr,
				uiTrad: uiFr.entries,
			}
		}
		case Lang.En: {
			return {
				name: 'English',
				abrv: 'en',
				abrvLocale: 'en-US',
				faqContent: faqEn,
				releases: releasesEn,
				uiTrad: uiEn.entries,
			}
		}
		case Lang.Es: {
			return {
				name: 'Español',
				abrv: 'es',
				abrvLocale: 'es-ES',
				faqContent: faqEs,
				releases: releasesEs,
				uiTrad: uiEs.entries,
			}
		}
		case Lang.It: {
			return {
				name: 'Italiano',
				abrv: 'it',
				abrvLocale: 'it-IT',
				faqContent: faqIt,
				releases: releasesIt,
				uiTrad: uiIt.entries,
			}
		}
	}
}

export function getLangFromAbreviation(abrv: string): Lang {
	switch (abrv) {
		case 'fr':
			return Lang.Fr
		case 'en':
		case 'en-us':
			return Lang.En
		case 'es':
			return Lang.Es
		case 'it':
			return Lang.It
		default:
			return Lang.Default
	}
}

export function getCurrentLangInfos(i18n: i18n): LangInfos {
	return getLangInfos(getLangFromAbreviation(i18n.language))
}

export function getCurrentLangAbrv(i18n: i18n): string {
	return getCurrentLangInfos(i18n).abrv
}

export function changeLangTo(i18n: i18n, currentLangState: Lang) {
	const langInfos = getLangInfos(currentLangState)
	if (langInfos) {
		i18n.changeLanguage(langInfos.abrv)
		console.log('[i18next] current language:', i18n.language)
	}
}
