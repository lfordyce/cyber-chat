import { Redirect, RouteComponentProps } from '@reach/router';
import React, { FunctionComponent } from 'react';
import { AuthStateContext } from '../context/Context';

type PropsHOC<
  T extends Partial<Record<string, string>>
> = RouteComponentProps<T> & {
  component: (props: RouteComponentProps<T>) => React.ReactNode;
};

interface ExtendProps extends React.PropsWithChildren<any> {
  pageComponent: FunctionComponent;
}

const PrivateRoute: FunctionComponent<ExtendProps> = ({
  children,
  ...props
}: ExtendProps & RouteComponentProps) => {
  const { pageComponent, ...others } = props;
  return <props.pageComponent {...others}>{children}</props.pageComponent>;
};

const Layout: FunctionComponent = () => {
  return <div>layout</div>;
};

const RouterPage = ({
  pageComponent,
  ...routerProps
}: {
  pageComponent: (routerProps: RouteComponentProps) => JSX.Element;
} & RouteComponentProps) => {
  return <Layout>{pageComponent(routerProps)}</Layout>;
};

interface TmpProps extends RouteComponentProps {
  as: (props: RouteComponentProps) => React.ReactNode;
}

// const RouterPage2 = ({
//   pageComponent,
//   ...routerProps
// }: {
//   pageComponent: (routerProps: RouteComponentProps) => JSX.Element;
// } & RouteComponentProps) => {
//   return <Layout>{pageComponent(routerProps)}</Layout>;
// };
