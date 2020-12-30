import React from 'react';
import './App.css';
import { v4 as uuid } from 'uuid';
import { useStream, useUnary } from './hooks';
import { Message, Close, Connect, User } from './proto/service_pb';
import { BroadcastClient, Broadcast } from './proto/service_pb_service';

const FIXTURES = {
  feed: [
    { id: '5ba5', name: 'Afterlife', isPrivate: true, unread: 3, icon: '' },
    { id: '4f22', name: 'NCPD-Gigs', isPrivate: true, unread: 0, icon: '' },
    { id: 'fee9', name: 'Pacifica', isPrivate: true, unread: 0, icon: '' },
    { id: 'a0cc', name: 'Watson', isPrivate: true, unread: 0, icon: '' },
    { id: 'dee3', name: '_T_SQUAD', isPrivate: true, unread: 2, icon: '' },
  ],
  conversation: [
    {
      id: 'cc23',
      isOnline: true,
      unread: 5,
      name: 'Rogue Amendiares',
    },
    { id: '95b4', isOnline: true, name: 'Takemura', unread: 1 },
    { id: '10cf', name: 'Wakado O., Regina Jones', unread: 0 },
    { id: 'e466', name: 'Dexter DeShawn', unread: 0 },
    { id: 'ca0b', name: 'Megabuilding H10 Administration', unread: 0 },
  ],
  messages: [
    {
      id: 'fd0cf',
      content:
        'I got a gig lined up in Watson, no biggie. If you prove useful, expect more side gigs coming your way. I need a half-decent netrunner. Hit me up, provide credentials, eddies on completion.',
      dateTime: '2077-10-09T11:04:57Z',
      author: {
        id: 'd12c',
        name: 'V.M. Vargas',
      },
    },
  ],
};

interface ICyberButtonProps {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  variant: string;
}

interface IConverstationLinkProps {
  conversation: IConversationProps;
}

interface IConversationProps {
  id: string;
  isOnline?: boolean;
  unread: number;
  name: string;
  members?: [];
}

interface IChannelLinkProps {
  id: string;
  icon: string;
  name: string;
  unread: number;
  isPrivate: boolean;
}

type FeeMessageProps = {
  message: Message.AsObject | null;
};

type BadgeProps = {
  children: React.ReactNode;
};

const Badge: React.FC<BadgeProps> = ({ children }: BadgeProps): JSX.Element => (
  <span className="badge">{children}</span>
);

type NavSectionProps = {
  children: React.ReactNode;
  renderTitle: (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => React.ReactNode;
};

const NavSection: React.FC<NavSectionProps> = ({
  children,
  renderTitle,
}: NavSectionProps) => (
  <div className="nav-section">
    <div className="nav-section__header">
      {renderTitle({ className: 'nav-section__title' })}
    </div>
    <div className="nav-section__body">{children}</div>
  </div>
);

const FeedMessage: React.FC<FeeMessageProps> = ({
  message,
}: FeeMessageProps) => (
  <div className="message">
    <div className="message__body">
      <div>{message?.content}</div>
    </div>
    <div className="message__footer">
      <span className="message__authoring">{message?.id}</span>
      {message?.timestamp}
    </div>
  </div>
);

const ChannelLink: React.FC<IChannelLinkProps> = ({
  id,
  unread,
  name,
  isPrivate,
  icon,
}: IChannelLinkProps) => (
  <span
    className={`channel-link ${unread > 0 ? 'conversation-link--unread' : ''}`}
  >
    <span className="channel-link__icon">#</span>
    <span className="channel-link__element">{name}</span>

    {unread > 0 && (
      <span className="channel-link__element">
        <Badge>{unread}</Badge>
      </span>
    )}
  </span>
);

type ChannelNavProps = {
  activeChannel: IChannelLinkProps | null;
  channels: IChannelLinkProps[];
};

const ChannelNav: React.FC<ChannelNavProps> = ({
  activeChannel = null,
  channels = [],
}: ChannelNavProps) => (
  <ul className="nav">
    {channels.map((channel) => (
      <li className="nav__item" key={channel.id}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          className={`nav__link ${
            activeChannel && activeChannel.id === channel.id
              ? 'nav__link--active'
              : ''
          }`}
          href="#"
        >
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <ChannelLink {...channel} />
        </a>
      </li>
    ))}
  </ul>
);

const ConversationLink: React.FC<IConverstationLinkProps> = ({
  conversation,
}: IConverstationLinkProps) => (
  <span
    className={`conversation-link ${
      conversation.isOnline ? 'conversation-link--online' : ''
    } ${conversation.unread > 0 ? 'conversation-link--unread' : ''}`}
  >
    {conversation.members && conversation.members.length > 2 ? (
      <span className="conversation-link__icon" />
    ) : (
      <span className="conversation-link__icon" />
    )}

    <span className="conversation-link__element">{conversation.name}</span>

    {conversation.unread > 0 && (
      <span className="conversation-link__element">
        <Badge>{conversation.unread}</Badge>
      </span>
    )}
  </span>
);

type ConversationNavProps = {
  activeConversation: IConversationProps | null;
  conversations: IConversationProps[];
};

const ConversationNav: React.FC<ConversationNavProps> = ({
  activeConversation = null,
  conversations = [],
}: ConversationNavProps) => (
  <ul className="nav">
    {conversations.map((convo) => (
      // eslint-disable-next-line react/jsx-key
      <li className="nav__item">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          className={`nav__link ${
            activeConversation && activeConversation.id === convo.id
              ? 'nav__link--active'
              : ''
          }`}
          href="#"
        >
          <ConversationLink conversation={convo} />
        </a>
      </li>
    ))}
  </ul>
);

const Button: React.FC<ICyberButtonProps> = ({
  children,
  type,
  variant,
}: ICyberButtonProps) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    className={`button ${variant ? `button--${variant}` : ''}`}
  >
    <span className="button__content">{children}</span>
  </button>
);

type PadProps = {
  children: React.ReactNode;
};

const Pad: React.FC<PadProps> = ({ children }: PadProps) => (
  <div className="pad">
    <div className="pad__body">{children}</div>
  </div>
);

// const H = (
//     props: React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLHeadingElement>,
//         HTMLHeadingElement
//         >
// ): JSX.Element => React.createElement("h" + this.props.size, props);

interface IHeadingPropsType {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className: string;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const HeadingComponent: React.FC<IHeadingPropsType> = ({
  level,
  children = null,
  className,
}: IHeadingPropsType) => {
  const Tag = `h${level}` as HeadingTag;
  return <Tag className={className}>{children}</Tag>;
};

function MakeIcon(svg: React.ReactNode) {
  const iconFunc: React.FC<{ className: string }> = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {svg}
    </svg>
  );
  return iconFunc;
}

const IconFeedMute = MakeIcon(
  <path d="M18 9.5c2.481 0 4.5 1.571 4.5 3.503 0 1.674-1.703 3.48-4.454 3.48-.899 0-1.454-.156-2.281-.357-.584.358-.679.445-1.339.686.127-.646.101-.924.081-1.56-.583-.697-1.007-1.241-1.007-2.249 0-1.932 2.019-3.503 4.5-3.503zm0-1.5c-3.169 0-6 2.113-6 5.003 0 1.025.37 2.032 1.023 2.812.027.916-.511 2.228-.997 3.184 1.302-.234 3.15-.754 3.989-1.268.709.173 1.388.252 2.03.252 3.542 0 5.954-2.418 5.954-4.98.001-2.906-2.85-5.003-5.999-5.003zm-.668 6.5h-1.719v-.369l.938-1.361v-.008h-.869v-.512h1.618v.396l-.918 1.341v.008h.95v.505zm3.035 0h-2.392v-.505l1.306-1.784v-.011h-1.283v-.7h2.25v.538l-1.203 1.755v.012h1.322v.695zm-10.338 9.5c1.578 0 2.971-1.402 2.971-3h-6c0 1.598 1.45 3 3.029 3zm.918-7.655c-.615-1.001-.947-2.159-.947-3.342 0-3.018 2.197-5.589 5.261-6.571-.472-1.025-1.123-1.905-2.124-2.486-.644-.374-1.041-1.07-1.04-1.82v-.003c0-1.173-.939-2.123-2.097-2.123s-2.097.95-2.097 2.122v.003c.001.751-.396 1.446-1.041 1.82-4.667 2.712-1.985 11.715-6.862 13.306v1.749h9.782c.425-.834.931-1.764 1.165-2.655zm-.947-15.345c.552 0 1 .449 1 1 0 .552-.448 1-1 1s-1-.448-1-1c0-.551.448-1 1-1z" />
);

const IconFeedSettings = MakeIcon(
  <path d="M6 16h-6v-3h6v3zm-2-5v-10h-2v10h2zm-2 7v5h2v-5h-2zm13-7h-6v-3h6v3zm-2-5v-5h-2v5h2zm-2 7v10h2v-10h-2zm13 3h-6v-3h6v3zm-2-5v-10h-2v10h2zm-2 7v5h2v-5h-2z" />
);

const IconMenuMore = MakeIcon(
  <path d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
);

const IconFeedAdd = MakeIcon(<path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z" />);

const IconShop = MakeIcon(
  <path d="M16.53 7l-.564 2h-15.127l-.839-2h16.53zm-14.013 6h12.319l.564-2h-13.722l.839 2zm5.983 5c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm11.305-15l-3.432 12h-13.017l.839 2h13.659l3.474-12h1.929l.743-2h-4.195zm-6.305 15c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z" />
);

function App(): JSX.Element {
  const [inputValue, setInputValue] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      id: 'fd0cf',
      content:
        'I got a gig lined up in Watson, no biggie. If you prove useful, expect more side gigs coming your way. I need a half-decent netrunner. Hit me up, provide credentials, eddies on completion.',
      dateTime: '2077-10-09T11:04:57Z',
      author: {
        id: 'd12c',
        name: 'V.M. Vargas',
      },
    },
  ]);

  const user = new User();
  const id: string = uuid();
  user.setId(id);
  user.setName('V.M. Vargas');
  const conn = new Connect();
  conn.setUser(user);

  // used to recieve message
  const useStream1 = useStream<Connect, Message>(conn, Broadcast.CreateStream);

  // const useUnary1 = useUnary<Message, Close>(conn, Broadcast.BroadcastMessage);

  const addMessage = (text: string) => {
    const newMessage = [
      {
        id: '23443wed',
        content: text,
        dateTime: '2077-10-09T11:04:57Z',
        author: {
          id: '12se3',
          name: 'Bruce',
        },
      },
      ...messages,
    ];
    setMessages(newMessage);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;
    addMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header__anchor">
          <span className="app-header__anchor__text">Night-City CyberChat</span>
        </div>
        <nav>
          <ul className="nav">
            <li className="nav__item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="nav__link" href="#">
                Home
              </a>
            </li>
            <li className="nav__item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="nav__link nav__link--active" href="#">
                <span className="nav__link__element">Messages</span>
                <span className="nav__link__element">
                  <Badge>11</Badge>
                </span>
              </a>
            </li>
            <li className="nav__item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="nav__link" href="#">
                Shop
              </a>
            </li>
            <li className="nav__item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="nav__link" href="#">
                Files
              </a>
            </li>
            <li className="nav__item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="nav__link" href="#">
                Map
              </a>
            </li>
          </ul>
        </nav>
        <div />
      </header>
      <div className="app-a">
        <div className="segment-topbar">
          <div className="segment-topbar__header">
            <HeadingComponent
              level={3}
              className="text-heading3 segment-topbar__title"
            >
              Messages
            </HeadingComponent>
          </div>
          <div className="segment-topbar__aside">
            <div className="button-toolbar">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="button button--primary">
                <IconFeedAdd className="button__icon" />
              </a>
            </div>
          </div>
        </div>

        <NavSection
          renderTitle={(
            props: JSX.IntrinsicAttributes &
              React.ClassAttributes<HTMLHeadingElement> &
              React.HTMLAttributes<HTMLHeadingElement>
            // eslint-disable-next-line react/jsx-props-no-spreading
          ) => <h2 {...props}>Feeds</h2>}
        >
          <ChannelNav
            activeChannel={{
              id: 'a0cc',
              name: 'Watson',
              unread: 0,
              isPrivate: false,
              icon: '',
            }}
            channels={FIXTURES.feed}
          />
        </NavSection>
        <NavSection
          renderTitle={(
            props: JSX.IntrinsicAttributes &
              React.ClassAttributes<HTMLHeadingElement> &
              React.HTMLAttributes<HTMLHeadingElement>
            // eslint-disable-next-line react/jsx-props-no-spreading
          ) => <h2 {...props}>Direct</h2>}
        >
          <ConversationNav
            conversations={FIXTURES.conversation}
            activeConversation={FIXTURES.conversation[0]}
          />
        </NavSection>
      </div>
      <div className="app-main">
        <div className="channel-feed">
          <div className="segment-topbar">
            <div className="segment-topbar__header">
              <span className="segment-topbar__overline">
                NetWire_Seed: d869db7fe62fb07c25a0403ecaea55031744b5fb
              </span>
              <HeadingComponent
                level={4}
                className="text-heading4 segment-topbar__title"
              >
                <ChannelLink
                  name="Watson"
                  unread={0}
                  icon=""
                  id=""
                  isPrivate={false}
                />
              </HeadingComponent>
            </div>
            <div className="segment-topbar__aside">
              <div className="button-toolbar">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="button button--primary">
                  <IconFeedMute className="button__icon" />
                </a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="button button--primary">
                  <IconFeedSettings className="button__icon" />
                </a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="button button--primary">
                  <IconMenuMore className="button__icon" />
                </a>
              </div>
            </div>
          </div>
          <div className="channel-feed__body">
            {useStream1.data.map((m) => (
              <FeedMessage
                key={(m as Message.AsObject).id}
                message={m as Message.AsObject}
              />
            ))}
          </div>
          <div className="channel-feed__footer">
            <form
              className="channel-message-form"
              action="#"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <div className="form-control">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    id="message"
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
          </div>
        </div>
      </div>
      <div className="app-b">
        <Pad>
          <HeadingComponent level={4} className="text-heading3">
            What&apos;s this?
          </HeadingComponent>
          <p className="text-paragraph1">
            A <em>fake</em> Slack or Discord type of app inspired by Cyberpunk
            2077. This app is static, eg. not implementing much logic.
          </p>
          <p className="text-paragraph1">
            The goal is: showcasing a start of a UI kit. If you&apos;ve played
            game, you&apos; might be able to pick-up some similarities with the
            in-game menus.
          </p>
        </Pad>
      </div>
    </div>
  );
}

export default App;
