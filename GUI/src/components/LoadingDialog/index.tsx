import {FC, PropsWithChildren} from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import './LoadingDialog.scss';
import clsx from "clsx";

type DialogProps = {
    title: string;
    size?: 'default' | 'large';
};

const LoadingDialog: FC<PropsWithChildren<DialogProps>> = ({ title, size = 'default', children }) => {
    return (
        <RadixDialog.Root defaultOpen={true}>
            <RadixDialog.Portal>
                <RadixDialog.Overlay className="dialog__overlay" />
                <RadixDialog.Content className={clsx('dialog', `dialog--${size}`)}>
                    <div className="dialog__header">
                        <RadixDialog.Title className="h3 dialog__title">{title}</RadixDialog.Title>
                    </div>
                    <div className="dialog__body">{children}</div>
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
};

export default LoadingDialog;
