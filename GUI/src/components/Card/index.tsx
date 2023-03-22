import { FC, PropsWithChildren, ReactNode } from 'react';

import './Card.scss';
import clsx from 'clsx';

type CardProps = {
  header?: ReactNode;
  footer?: ReactNode;
  borderless?: boolean;
  [rest: string]: any;
}

const Card: FC<PropsWithChildren<CardProps>> = ({ header, footer, borderless, children, ...rest }) => {
  return (
    <div className={clsx('card', { 'card--borderless': borderless })} {...rest}>
      {header && <div className='card__header'>{header}</div>}
      <div className='card__body'>
        {children}
      </div>
      {footer && (
        <div className='card__footer'>{footer}</div>
      )}
    </div>
  );
};

export default Card;
