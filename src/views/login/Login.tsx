import React from 'react';
import { v4 as uuid } from 'uuid';
import { AuthStateContext } from '../../context/Context';
import { Types } from '../../context/reducers';

const Login: React.FC = () => {
  const { dispatch } = React.useContext(AuthStateContext);
  const [user, setUser] = React.useState<string>('');

  const onSubmitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const id: string = uuid();
    dispatch({
      type: Types.Login,
      payload: {
        isAuthenticated: true,
        name: user,
        updating: true,
        userId: 1,
        token: id,
        expiresAt: '2',
      },
    });
    setUser('');
  };

  const onChangeHandler = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setUser(target.value);
  };

  return (
    <div>
      <form action="#" onSubmit={onSubmitHandler}>
        <input type="text" value={user} onChange={onChangeHandler} />
      </form>
    </div>
  );
};

export default Login;
