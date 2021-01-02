import React, { Suspense, lazy, FunctionComponent } from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import SuspenseFallback from '../components/SuspenseFallback';
import AuthProvider, { AuthContext } from '../context/Context';

type Props<T> = { as: FunctionComponent<T> } & RouteComponentProps<T>;

const ProtectedRoute: FunctionComponent<Props<any>> = ({
  as: Component,
  ...props
}: Props<any>) => {
  const userContext = React.useContext(AuthContext);
  const { ...rest } = props;
  return userContext.authPayload?.name ? (
    <Component {...rest} />
  ) : (
    <Redirect from="" to="/login" noThrow />
  );
};

const Dashboard = () => {
  return <div>Protected Dashboard</div>;
};

const ChatHome = lazy(() => import('../views/chat/App'));

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
  const userContext = React.useContext(AuthContext);
  const { ...rest } = props;
  return userContext.authPayload?.name ? (
    <Component {...rest} />
  ) : (
    <Redirect from="" to="/login" noThrow />
  );
};

const IndexRouter: React.FC = (): React.ReactElement => {
  return (
    <AuthProvider>
      <Suspense fallback={SuspenseFallback}>
        <Router>
          <RouterPage path="/" pageComponent={<ChatHome />} />
          <ProtectedRoute as={Dashboard} path="/" />
          <LazyPrivateRoute
            as={lazy(() => import('../views/chat/App'))}
            path="/chat"
          />
        </Router>
      </Suspense>
    </AuthProvider>
  );
};

export default IndexRouter;
