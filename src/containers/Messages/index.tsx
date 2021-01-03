import * as React from 'react';
import MessageForm from '../../components/MessageForm';
import Messages from '../../components/Messages';
import useMessages from './hooks/useMessages';
import useMessageForm from './hooks/useMessageForm';
import { GRPCClients } from '../../gRPCClients';

type Props = {
  clients: GRPCClients;
};

export const MessagesContainer: React.FC<Props> = ({ clients }: Props) => {
  const { broadcastClient } = clients;
  const messagesState = useMessages(broadcastClient);
  const messageFormState = useMessageForm(broadcastClient);

  return (
    <>
      <Messages {...messagesState} />
      <div className="channel-feed__footer">
        <MessageForm {...messageFormState} />
      </div>
    </>
  );
};

export default MessagesContainer;
