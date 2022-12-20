import { FC, PropsWithChildren, ReactNode } from 'react';

import './Card.scss';

type CardProps = {
  header?: ReactNode;
}

const Card: FC<PropsWithChildren<CardProps>> = ({ header, children }) => {
  return (
    <div className='card'>
      {header && <div className='card__header'>{header}</div>}
      <div className='card__body'>
        {children}
      </div>
    </div>
  );
};

export default Card;
