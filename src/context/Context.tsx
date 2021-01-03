import React from 'react';
import { authReducer, AuthActions, AuthType } from './reducers';

// export interface AuthenticationPayload {
//   isAuthenticated: boolean;
//   updating: boolean;
//   userId: number | undefined;
//   name: string | undefined;
//   token: string | undefined;
//   expiresAt: string | undefined;
// }
//
// export type State = {
//   isAuthenticated: boolean;
//   updating: boolean;
//   userId: number;
//   name: string;
//   token: string;
//   expiresAt: string;
// };
//
// export type AuthenticationAction =
//   | { type: 'LOGIN'; payload?: AuthenticationPayload }
//   | { type: 'LOGOUT'; payload?: AuthenticationPayload }
//   | { type: 'UPDATE_USER'; payload?: AuthenticationPayload };
//
// export type Dispatch = (
//   action: AuthenticationAction,
//   payload?: AuthenticationPayload
// ) => void;
//
// export interface IAuthContext {
//   authPayload: AuthenticationPayload | undefined;
//   setState: (authInfo: AuthenticationPayload) => void;
// }

// export const AuthStateContext = React.createContext<Partial<IAuthContext>>(
//   undefined!
// );
//
// export const AuthDispatchContext = React.createContext<Dispatch | undefined>(
//   undefined
// );

// const AuthenticationStateContext = React.createContext(null);
// const AuthenticationDispatchContext = React.createContext(
//   {} as React.Dispatch<AuthenticationAction>
// );
// const AuthStateProvider = AuthenticationStateContext.Provider;
// const AuthStateConsumer = AuthenticationStateContext.Consumer;

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

// export const AuthDispatchContext = React.createContext<Dispatch | undefined>(
//   undefined
// );

function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

// function useAuthDispatch() {
//   const context = React.useContext(AuthDispatchContext);
//   if (context === undefined) {
//     throw new Error('useAuthDispatch must be used within a AuthProvider');
//   }
//   return context;
// }

// const authReducer = (state: IAuthContext, action: AuthenticationAction) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return {
//         ...state,
//         name: action.payload?.name,
//         isAuthenticated: action.payload?.isAuthenticated,
//         userId: action.payload?.userId,
//         token: action.payload?.token,
//         expiresAt: action.payload?.expiresAt,
//         updating: action.payload?.updating,
//       };
//     case 'LOGOUT':
//       return initialState;
//     case 'UPDATE_USER':
//       return {
//         ...state,
//         name: action.payload?.name,
//       };
//     default: {
//       throw new Error(`Unhandled action: ${action}`);
//     }
//   }
// };

// const mainAuthReducer = ({ user: AuthType}, action: AuthActions) => ({
//   authReducer()
// });

// const AuthProvider: React.FC = (props) => {
//   const [authState, setAuthState] = React.useState<AuthenticationPayload>();
//   const setAuthInfo = (data: AuthenticationPayload) => {
//     console.log('Called setAuthInfo', data);
//     setAuthState({
//       isAuthenticated: data!.isAuthenticated,
//       updating: data!.updating,
//       userId: data!.userId,
//       name: data!.name,
//       token: data!.token,
//       expiresAt: data!.expiresAt,
//     });
//   };
//   return (
//     <AuthStateContext.Provider
//       value={{
//         authPayload: authState,
//         setState: (authInfo: AuthenticationPayload) => setAuthInfo(authInfo),
//       }}
//       {...props}
//     />
//   );
// };

const AuthenticationProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  return <AuthStateContext.Provider value={{ state, dispatch }} {...props} />;
};

export { AuthenticationProvider, AuthStateContext };
