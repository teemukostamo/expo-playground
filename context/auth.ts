import { Dispatch } from 'react';
import { ActionTypes } from './main';

export type Auth = {
  token: string | null;
  expiresAt: string | null;
};

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export interface AuthAction {
  type: typeof LOGIN | typeof LOGOUT;
  data: {
    token: string | null;
    expiresAt: string | null;
  };
}

export const authReducer = (state: Auth, action: AuthAction) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.data.token,
        expiresAt: action.data.expiresAt,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        expiresAt: null,
      };
    default:
      return state;
  }
};

export const loginAction = (
  dispatch: Dispatch<ActionTypes>,
  token: string,
  expiresAt: string
) => {
  dispatch({ type: LOGIN, data: { token, expiresAt } });
};

export const logoutAction = (
  dispatch: Dispatch<ActionTypes>,
  token = null,
  expiresAt = null
) => {
  dispatch({ type: LOGOUT, data: { token, expiresAt } });
};
