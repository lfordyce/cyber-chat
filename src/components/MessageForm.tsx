import React from 'react';
import useMessageForm from '../containers/Messages/hooks/useMessageForm';
import Button from './Button';

type Props = ReturnType<typeof useMessageForm>;

const MessageForm: React.FC<Props> = ({
  message,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <form className="channel-message-form" action="#" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <div className="form-control">
          <input
            type="text"
            id="message"
            value={message}
            onChange={onChange}
            className="form-control"
            name="message"
          />
        </div>
      </div>
      <div className="form-footer">
        <Button type="submit" variant="">
          Send
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
