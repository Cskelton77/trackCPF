import styled from 'styled-components';
import { theme } from '@/theme';

export const NewItemModal = styled.form`
  display: flex;
  align-self: center;
  flex-direction: column;
  background-color: ${theme.colours.white};
  padding: ${theme.layoutPadding};
`;

export const ItemName = styled.div`
  align-self: center;
  border: 1px solid ${theme.colours.darkGrey};
  padding: ${theme.buttonPadding};
`;

export const ItemAttributes = styled.div`
  align-self: center;
  padding: ${theme.buttonPadding};
  border: 1px solid grey;
`;
export const EntryLabel = styled.label`
  display: flex;
  align-items: center;
  padding: ${theme.inputPadding};
  color: ${theme.colours.black};
`;

export const EntryBox = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.inputPadding};
  color: ${theme.colours.black};
`;
export const AttributeInput = styled.input`
  height: 36px;
  padding: ${theme.inputPadding};
  //   border-radius: 8px;
  margin-right: 12px;
  border: none;
  border-bottom: 1px solid ${theme.colours.black};
  background-color: ${theme.colours.white};
  color: ${theme.colours.black};
`;
export const TextDisplay = styled.label``;

export const Actions = styled.div`
  width: 65%;
  align-self: center;
  justify-content: space-around;
  display: flex;
`;

const Action = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${theme.colours.darkGrey};
  padding: ${theme.inputPadding};
  text-align: center;
  flex: 1;
`;
export const DiscardAction = styled(Action)`
  background-color: #ca7068;
`;

export const SaveAction = styled.button`
  background-color: #6c824e;
  flex: 1;
  border: 1px solid ${theme.colours.darkGrey};
`;
