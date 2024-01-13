import { Dispatch } from 'react';
import { ActionTypes } from './main';
import type { ThemeName } from 'tamagui';

export type LayoutStateType = {
  lang: string;
  isMenuOpen: boolean;
  theme: ThemeName;
};

const SET_LANGUAGE = 'SET_LANGUAGE';
const TOGGLE_MENU = 'TOGGLE_MENU';
const TOGGLE_THEME = 'TOGGLE_THEME';

interface LanguageActionType {
  type: typeof SET_LANGUAGE;
  data: {
    lang: string;
  };
}

interface ToggleMenuActionType {
  type: typeof TOGGLE_MENU;
  data: {
    isMenuOpen: boolean;
  };
}

interface ToggleThemeActionType {
  type: typeof TOGGLE_THEME;
  data: {
    theme: ThemeName;
  };
}

export type LayoutActionType =
  | LanguageActionType
  | ToggleMenuActionType
  | ToggleThemeActionType;

export const initialLocaleState = {
  lang: 'en',
  isMenuOpen: false,
  theme: 'dark',
};

export const isLayoutAction = (
  action: ActionTypes
): action is LayoutActionType =>
  action.type === SET_LANGUAGE ||
  action.type === TOGGLE_MENU ||
  action.type === TOGGLE_THEME;

export const localeReducer = (
  state: LayoutStateType,
  action: LayoutActionType
): LayoutStateType => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        lang: action.data.lang,
      };
    case TOGGLE_MENU:
      return {
        ...state,
        isMenuOpen: action.data.isMenuOpen,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: action.data.theme,
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

export const toggleMenuAction = (
  dispatch: Dispatch<ActionTypes>,
  isMenuOpen: boolean
) => {
  dispatch({ type: TOGGLE_MENU, data: { isMenuOpen } });
};

export const toggleThemeAction = (
  dispatch: Dispatch<ActionTypes>,
  theme: ThemeName
) => {
  dispatch({ type: TOGGLE_THEME, data: { theme } });
};
