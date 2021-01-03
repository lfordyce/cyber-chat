import React from 'react';
import { authReducer, AuthActions, AuthType } from './reducers';

const initialState = {
  isAuthenticated: false,
  updating: false,
  userId: undefined,
  name: undefined,
  token: undefined,
  expiresAt: undefined,
};

const AuthStateContext = React.createContext<{
  state: AuthType;
  dispatch: React.Dispatch<AuthActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AuthenticationProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  return <AuthStateContext.Provider value={{ state, dispatch }} {...props} />;
};

export { AuthenticationProvider, AuthStateContext };
