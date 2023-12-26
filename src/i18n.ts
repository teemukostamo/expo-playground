import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import { getData, storeData } from './utils/AsyncStorageUtil';
import { AVAILABLE_LANGUAGES } from './constants';

import fi from '../assets/locales/fi.json';
import en from '../assets/locales/en.json';

export const changeLanguage = async (language: string) => {
  try {
    await storeData('lang', language);
    i18n.locale = language;
    // Notify the app about the language change if necessary
  } catch (e) {
    console.error('Error saving language preference', e);
  }
};

const initLanguage = async (i18n: { locale: string }) => {
  try {
    const savedLocale = await getData('lang');
    let deviceLang = getLocales()[0].languageCode;

    if (savedLocale) {
      i18n.locale = savedLocale;
    } else {
      if (AVAILABLE_LANGUAGES.includes(deviceLang)) {
        i18n.locale = deviceLang;
        // todo save deviceLang to storage
      } else {
        i18n.locale = 'en';
        // todo save deviceLang to storage
      }
    }
  } catch (e) {
    console.error('error reading data with key: lang', e);
  }
};

const i18n = new I18n({
  en,
  fi,
});

initLanguage(i18n);

export default i18n;
