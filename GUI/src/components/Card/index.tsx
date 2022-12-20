import { FC, PropsWithChildren } from 'react';

import './Card.scss';

const Card: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='card'>
      <div className='card__body'>
        {children}
      </div>
    </div>
  );
};

export default Card;
