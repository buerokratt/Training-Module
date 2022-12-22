import { FC } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { MdOutlineClose } from 'react-icons/md';

import { Icon } from 'components';
import type { ToastType } from 'context/ToastContext';
import clsx from 'clsx';

type ToastProps = {
  toast: ToastType;
  close: () => void;
}

const Toast: FC<ToastProps> = ({ toast, close }) => {
  const toastClasses = clsx(
    'toast',
    `toast--${toast.type}`,
  );

  console.log(toast);

  return (
    <RadixToast.Root className={toastClasses} onEscapeKeyDown={() => close()}>
      <RadixToast.Title className='toast__title'>{toast.title}</RadixToast.Title>
      <RadixToast.Description asChild>
        {toast.message}
      </RadixToast.Description>
      <RadixToast.Close onClick={() => close()}>
        <Icon icon={<MdOutlineClose />} size='medium' />
      </RadixToast.Close>
    </RadixToast.Root>
  );
};

export default Toast;
