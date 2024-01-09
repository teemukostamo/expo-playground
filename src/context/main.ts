import { createContext, Dispatch } from 'react';

import type { Auth, AuthAction } from './auth';
import { authReducer, isAuthAction } from './auth';

import type { Locale, LocaleAction } from './locale';
import { localeReducer, isLocaleAction } from './locale';

type InitialStateType = {
  auth: Auth;
  locale: Locale;
};

export const initialState = {
  auth: {
    token: null,
    expiresAt: null,
  },
  locale: {
    lang: 'en',
  },
};

export type ActionTypes = AuthAction | LocaleAction;

export const mainReducer = (
  { auth, locale }: InitialStateType,
  action: ActionTypes
): InitialStateType => ({
  auth: isAuthAction(action) ? authReducer(auth, action) : auth,
  locale: isLocaleAction(action) ? localeReducer(locale, action) : locale,
});

export const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<ActionTypes>;
}>({
  state: initialState,
  dispatch: ({}) => {},
});
