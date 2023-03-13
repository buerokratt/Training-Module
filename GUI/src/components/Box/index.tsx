import { forwardRef, PropsWithChildren } from 'react';
import clsx from 'clsx';

import './Box.scss';

type BoxProps = {
  color?: 'default' | 'blue' | 'yellow' | 'green' | 'red' | 'gray' | 'dark-blue' | 'orange';
  [rest:string]: any;
}

const Box = forwardRef<HTMLDivElement, PropsWithChildren<BoxProps>>(({ color = 'default', children, ...rest }, ref,) => {
  return (
    <div ref={ref} className={clsx(['box', `box--${color}`])} {...rest}>{children}</div>
  );
});

export default Box;
