import { FC, PropsWithChildren, ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

import { Track } from "..";
import "./Modal.scss";

type ModalProps = {
  title: string | null;
  footer?: ReactNode;
  onClose: () => void;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({ title, footer, onClose, children }) => {
  return (
    <RadixDialog.Root defaultOpen={true} onOpenChange={onClose}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="modal__overlay" />
        <RadixDialog.Content className="modal">
          {title && (
            <div className="modal__header">
              <RadixDialog.Title className="h3 modal__title">{title}</RadixDialog.Title>
            </div>
          )}
          <div className="modal__body">{children}</div>
          {footer && (
            <Track className="modal__footer" gap={16} justify="end">
              {footer}
            </Track>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Modal;
