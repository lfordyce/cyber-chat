import React from 'react';

interface ICyberButtonProps {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  variant: string;
}

export const Button: React.FC<ICyberButtonProps> = ({
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

export default { Button };
