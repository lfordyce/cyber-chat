import React from 'react';

interface IPayload {
  user: string;
  token: string;
}

export interface AuthenticationPayload {
  isAuthenticated: boolean;
  updating: boolean;
  userId: number;
  name: string;
  token: string;
  expiresAt: string;
}

export type AuthenticationAction =
  | { type: 'LOGIN'; payload?: AuthenticationPayload }
  | { type: 'LOGOUT'; payload?: AuthenticationPayload }
  | { type: 'UPDATE_USER'; payload?: AuthenticationPayload };

export type Dispatch = (
  action: AuthenticationAction,
  payload?: AuthenticationPayload
) => void;
export type ProviderProps = { children: any };

export const AuthContext = React.createContext<Partial<IAuthContext>>(
  undefined!
);

export const AuthDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

// const AuthenticationStateContext = React.createContext(null);
// const AuthenticationDispatchContext = React.createContext(
//   {} as React.Dispatch<AuthenticationAction>
// );

// const AuthStateProvider = AuthenticationStateContext.Provider;
// const AuthStateConsumer = AuthenticationStateContext.Consumer;

function useAuthState() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}

export interface IAuthContext {
  authPayload: AuthenticationPayload | undefined;
  setState: (authInfo: AuthenticationPayload) => void;
}

const authReducer = (state: IAuthContext, action: AuthenticationAction) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
      };
    case 'LOGOUT':
      return {};
    case 'UPDATE_USER':
      return {};
    default: {
      throw new Error(`Unhandled action: ${action}`);
    }
  }
};

const AuthProvider: React.FC = (props) => {
  const [authState, setAuthState] = React.useState<AuthenticationPayload>();
  const setAuthInfo = (data: AuthenticationPayload) => {
    console.log('Called setAuthInfo', data);
    setAuthState({
      isAuthenticated: data!.isAuthenticated,
      updating: data!.updating,
      userId: data!.userId,
      name: data!.name,
      token: data!.token,
      expiresAt: data!.expiresAt,
    });
  };
  return (
    <AuthContext.Provider
      value={{
        authPayload: authState,
        setState: (authInfo: AuthenticationPayload) => setAuthInfo(authInfo),
      }}
      {...props}
    />
  );
};

export default AuthProvider;
