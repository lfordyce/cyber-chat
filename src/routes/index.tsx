import React, { Suspense, lazy, FunctionComponent } from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import SuspenseFallback from '../components/SuspenseFallback';
import { AuthStateContext, AuthenticationProvider } from '../context/Context';
import Login from '../views/login/Login';

type Props<T> = { as: FunctionComponent<T> } & RouteComponentProps<T>;

const ProtectedRoute: FunctionComponent<Props<any>> = ({
  as: Component,
  ...props
}: Props<any>) => {
  const userContext = React.useContext(AuthStateContext);
  const { ...rest } = props;
  return userContext.state?.name ? (
    <Component {...rest} />
  ) : (
    // <Redirect from="" to="/login" noThrow />
    <Login />
  );
};

const ChatHome = lazy(() => import('../views/chat/App'));
const LazyChatHome = lazy(() => {
  return new Promise((resolve) => setTimeout(resolve, 5 * 1000)).then(() =>
    Math.floor(Math.random() * 10) >= 4
      ? import('../views/chat/App')
      : Promise.reject(new Error())
  );
});

const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;

type LazyProps = {
  as: React.LazyExoticComponent<any>;
} & RouteComponentProps;

const LazyPrivateRoute: FunctionComponent<LazyProps> = ({
  as: Component,
  ...props
}: LazyProps) => {
  const userContext = React.useContext(AuthStateContext);
  const { ...rest } = props;
  return userContext.state?.name ? (
    <Component {...rest} />
  ) : (
    // <Redirect from="" to="/login" noThrow />
    <Login />
  );
};

const IndexRouter: React.FC = (): React.ReactElement => {
  return (
    <AuthenticationProvider>
      <Suspense fallback={SuspenseFallback}>
        <Router>
          {/* <RouterPage path="/" pageComponent={<ChatHome />} /> */}
          <ProtectedRoute as={ChatHome} path="/" />
          {/* <LazyPrivateRoute */}
          {/*  as={lazy(() => import('../views/chat/App'))} */}
          {/*  path="/" */}
          {/* /> */}
        </Router>
      </Suspense>
    </AuthenticationProvider>
  );
};

export default IndexRouter;
