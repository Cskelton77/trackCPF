import { ForwardedRef, forwardRef } from 'react';
import { ModalClose, ModalHeader, ModalWindow } from './Modal.style';

export interface ModalInterface {
  title?: string;
  isVisible: boolean;
  close?: () => void;
  children: JSX.Element;
}
const Modal = forwardRef(
  ({ title, isVisible, close, children }: ModalInterface, ref: ForwardedRef<HTMLDivElement>) => {
    return isVisible ? (
      <ModalWindow ref={ref}>
        <ModalHeader>
          <span>{title || `Modal`}</span>
          <ModalClose
            role="button"
            aria-label="Close Modal"
            onClick={close ? () => close() : undefined}
          >
            X
          </ModalClose>
        </ModalHeader>
        {children}
      </ModalWindow>
    ) : (
      <></>
    );
  },
);

export default Modal;
