import React from 'react';
import classNames from 'classnames';

const isMobile = () => {
  const ua = navigator.userAgent;
  return /Android|Mobi/i.test(ua);
};

const Cursor: React.FC = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [clicked, setClicked] = React.useState(false);
  const [linkHovered, setLinkHovered] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const onMouseMove = (event: MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const onMouseDown = () => {
    setClicked(true);
  };

  const onMouseUp = () => {
    setClicked(false);
  };

  const onMouseLeave = () => {
    setHidden(true);
  };

  const onMouseEnter = () => {
    setHidden(false);
  };

  const handleLinkHoverEvents = () => {
    document.querySelectorAll('a').forEach((el) => {
      el.addEventListener('mouseover', () => setLinkHovered(true));
      el.addEventListener('mouseout', () => setLinkHovered(false));
    });
  };

  const addEventListeners = React.useCallback(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const removeEventListeners = React.useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseenter', onMouseEnter);
    document.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const cursorClasses = classNames('cursor', {
    'cursor--clicked': clicked,
    'cursor--hidden': hidden,
    'cursor--link-hovered': linkHovered,
  });

  React.useEffect(() => {
    addEventListeners();
    handleLinkHoverEvents();
    return () => removeEventListeners();
  }, [addEventListeners, removeEventListeners]);

  if (typeof navigator !== 'undefined' && isMobile()) return null;

  return (
    <div
      className={cursorClasses}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

export default Cursor;
