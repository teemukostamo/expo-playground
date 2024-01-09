import { Dispatch } from 'react';
import { ActionTypes } from './main';

export type Locale = {
  lang: string;
};

const SET_LANGUAGE = 'SET_LANGUAGE';

export interface LocaleAction {
  type: typeof SET_LANGUAGE;
  data: {
    lang: string;
  };
}

export const initialLocaleState = {
  lang: 'en',
};

export const isLocaleAction = (action: ActionTypes): action is LocaleAction =>
  action.type === 'SET_LANGUAGE';

export const localeReducer = (state: Locale, action: LocaleAction): Locale => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        lang: action.data.lang,
      };
    default:
      return state;
  }
};

export const setLanguageAction = (
  dispatch: Dispatch<ActionTypes>,
  lang: string
) => {
  dispatch({ type: SET_LANGUAGE, data: { lang } });
};
