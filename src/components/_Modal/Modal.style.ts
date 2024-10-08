import { theme } from '@/theme';
import styled from 'styled-components';

export const ModalWindow = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  background-color: ${theme.colours.white};
  padding: ${theme.padding.large};
  color: ${theme.colours.black};
  overflow: scroll;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  & span {
    font-size: 24px;
  }
`;

export const ModalClose = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid black;
  height: 25px;
  width: 25px;
  cursor: pointer;
`;
