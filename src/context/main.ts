import { createContext, Dispatch } from 'react';

import type { Auth, AuthAction } from './auth';
import { authReducer, isAuthAction } from './auth';

import type { LayoutStateType, LayoutActionType } from './layout';
import { localeReducer, isLayoutAction } from './layout';

type InitialStateType = {
  auth: Auth;
  layout: LayoutStateType;
};

export const initialState: InitialStateType = {
  auth: {
    token: null,
    expiresAt: null,
  },
  layout: {
    lang: 'en',
    isMenuOpen: false,
    theme: 'dark',
  },
};

export type ActionTypes = AuthAction | LayoutActionType;

export const mainReducer = (
  { auth, layout }: InitialStateType,
  action: ActionTypes
): InitialStateType => ({
  auth: isAuthAction(action) ? authReducer(auth, action) : auth,
  layout: isLayoutAction(action) ? localeReducer(layout, action) : layout,
});

export const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<ActionTypes>;
}>({
  state: initialState,
  dispatch: ({}) => {},
});
