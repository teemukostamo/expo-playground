import { createContext, Dispatch } from 'react';

import type { Auth, AuthAction } from './auth';
import { authReducer } from './auth';

type InitialStateType = {
  auth: Auth;
};

export const initialState = {
  auth: {
    token: null,
    expiresAt: null,
  },
};

export type ActionTypes = AuthAction;

export const mainReducer = (
  { auth }: InitialStateType,
  action: ActionTypes
) => ({
  auth: authReducer(auth, action),
});

export const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<ActionTypes>;
}>({
  state: initialState,
  dispatch: ({}) => null,
});
