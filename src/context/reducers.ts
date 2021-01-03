type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  UpdateUser = 'UPDATE_USER',
}

export type AuthType = {
  isAuthenticated: boolean;
  updating: boolean;
  userId: number | undefined;
  name: string | undefined;
  token: string | undefined;
  expiresAt: string | undefined;
};

type AuthPayload = {
  [Types.Login]: {
    isAuthenticated: boolean;
    updating: boolean;
    userId: number | undefined;
    name: string | undefined;
    token: string | undefined;
    expiresAt: string | undefined;
  };
  [Types.Logout]: {
    isAuthenticated: boolean;
    updating: boolean;
    userId: number | undefined;
    name: string | undefined;
    token: string | undefined;
    expiresAt: string | undefined;
  };
  [Types.UpdateUser]: {
    userId: number | undefined;
    name: string | undefined;
    token: string | undefined;
  };
};

export type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export const authReducer = (state: AuthType, action: AuthActions) => {
  switch (action.type) {
    case Types.Login:
      return {
        ...state,
        name: action.payload?.name,
        isAuthenticated: action.payload?.isAuthenticated,
        userId: action.payload?.userId,
        token: action.payload?.token,
        expiresAt: action.payload?.expiresAt,
        updating: action.payload?.updating,
      };
    case Types.Logout:
    case Types.UpdateUser:
    default:
      // return state;
      throw new Error(`Unhandled action: ${action}`);
  }
};
