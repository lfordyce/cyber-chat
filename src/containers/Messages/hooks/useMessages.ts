import * as React from 'react';
import { grpc } from '@improbable-eng/grpc-web';
import { v4 as uuid } from 'uuid';
import { BroadcastClient } from '../../../proto/service_pb_service';
import { Close, Message, User, Connect } from '../../../proto/service_pb';

export const useMessages = (client: BroadcastClient) => {
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    const user = new User();
    user.setName('bruce');
    const id: string = uuid();
    user.setId(id);
    const conn = new Connect();
    conn.setUser(user);
    const stream = client.createStream(conn, new grpc.Metadata());
    stream.on('data', (m: Message) => {
      setMessages((state) => [...state, m]);
    });
  }, [client]);
  return {
    messages,
  };
};

export default {
  useMessages,
};
