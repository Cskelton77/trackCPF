import { ModalClose, ModalHeader, ModalWindow } from './Modal.style';

export interface ModalInterface {
  title?: string;
  isVisible: boolean;
  close?: () => void;
  children: JSX.Element;
}
const Modal = ({ title, isVisible, close, children }: ModalInterface) => {
  return isVisible ? (
    <ModalWindow>
      <ModalHeader>
        <span>{title || `Modal`}</span>
        <ModalClose onClick={close ? () => close() : undefined} />
      </ModalHeader>
      {children}
    </ModalWindow>
  ) : (
    <></>
  );
};

export default Modal;
