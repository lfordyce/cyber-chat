import * as React from 'react';
import { Message } from '../proto/service_pb';
import TypeWriter from './TypeWriter';

type FeeMessageProps = {
  message: Message;
};

type Props = {
  messages: Message[];
};

const FeedMessage: React.FC<FeeMessageProps> = ({
  message,
}: FeeMessageProps) => (
  <div className="message">
    <div className="message__body">
      <TypeWriter
        typingDelay={75}
        erasingDelay={75}
        newTextDelay={200}
        textArray={[message.getContent()]}
        loop={false}
      />
    </div>
    <div className="message__footer">
      <span className="message__authoring">{message.getId()}</span>
      {message.getTimestamp()}
    </div>
  </div>
);

const Messages: React.FC<Props> = ({ messages }: Props) => {
  return (
    <div className="channel-feed__body">
      {messages.map((m: Message, idx: number) => (
        <FeedMessage key={m.getId()} message={m} />
      ))}
    </div>
  );
};

export default Messages;
