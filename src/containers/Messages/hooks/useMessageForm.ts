import * as React from 'react';
import { grpc } from '@improbable-eng/grpc-web';
import { v4 as uuid } from 'uuid';
import { Broadcast, BroadcastClient } from '../../../proto/service_pb_service';
import { Close, Message, User, Connect } from '../../../proto/service_pb';
import { AuthStateContext } from '../../../context/Context';

export const useMessageForm = (client: BroadcastClient) => {
  const [message, setMessage] = React.useState<string>('');
  const { state } = React.useContext(AuthStateContext);

  const onChange = React.useCallback(
    (event: React.SyntheticEvent) => {
      const target = event.target as HTMLInputElement;
      setMessage(target.value);
    },
    [setMessage]
  );

  const onSubmit = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      const req = new Message();
      req.setId(state.token || uuid());
      req.setTimestamp(Date.now().toString());
      req.setContent(message);
      const meta = new grpc.Metadata();
      client.broadcastMessage(req, meta, (res) => console.log(res));
      setMessage('');
    },
    [client, message, state]
  );
  return {
    message,
    onChange,
    onSubmit,
  };
};

export default {
  useMessageForm,
};
