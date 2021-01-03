import * as React from 'react';
import { grpc } from '@improbable-eng/grpc-web';
import { v4 as uuid } from 'uuid';
import { BroadcastClient } from '../../../proto/service_pb_service';
import { Close, Message, User, Connect } from '../../../proto/service_pb';
import { AuthStateContext } from '../../../context/Context';

const useMessages = (client: BroadcastClient) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { state } = React.useContext(AuthStateContext);

  React.useEffect(() => {
    const user = new User();
    user.setName(state.name || 'anonymous');
    user.setId(state.token || uuid());
    const conn = new Connect();
    conn.setUser(user);

    const stream = client.createStream(conn, new grpc.Metadata());
    stream.on('data', (m: Message) => {
      setMessages((messageState) => [...messageState, m]);
    });
  }, [client, state]);
  return {
    messages,
  };
};

export default useMessages;
