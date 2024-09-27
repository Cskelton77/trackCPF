import styled from 'styled-components';
import { theme } from '@/theme';

export const NewItemModal = styled.form`
  display: flex;
  align-self: center;
  flex-direction: column;
  background-color: ${theme.colours.white};
  padding: ${theme.padding.large};
`;

export const ItemName = styled.div`
  align-self: center;
  padding: ${theme.padding.medium};
`;

export const ItemAttributes = styled.div`
  align-self: center;
  padding: ${theme.padding.medium};
`;
export const EntryLabel = styled.label`
  font-size: 24px;
  display: flex;
  align-items: center;
  padding: ${theme.padding.small};
  color: ${theme.colours.black};
`;

export const EntryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.padding.small};
  color: ${theme.colours.black};
`;
export const AttributeInput = styled.input`
  height: 48px;
  font-size: 36px;
  width: 40%;
  padding: ${theme.padding.small};

  background-color: ${theme.colours.white};
  color: ${theme.colours.black};
`;
export const TextDisplay = styled.label`
  padding-left: ${theme.padding.medium};
  font-size: 18px;
  width: 20%;
`;

export const Actions = styled.div`
  width: 100%;
  align-self: center;
  justify-content: space-around;
  display: flex;
  padding: ${theme.padding.medium};
`;

const Action = styled.div`
  width: 100%;
  height: 100%;

  border: 1px solid ${theme.colours.darkGrey};
  padding: ${theme.padding.medium};
  text-align: center;
  flex: 1;
`;
export const DiscardAction = styled(Action)`
  background-color: #ca7068;
  flex: 1;
  font-size: ${theme.fontSize.small};
  margin-right: 4px;
`;

export const DeleteAction = styled(Action)`
  background-color: #ca7068;
  flex: 1;
  font-size: ${theme.fontSize.small};
`;

export const SaveAction = styled.button`
  margin-left: 4px;
  font-size: ${theme.fontSize.small};
  background-color: #6c824e;
  flex: 2;
  border: 1px solid ${theme.colours.darkGrey};
`;

export const PlantPointsSelector = styled.select`
  font-size: 28px;
  padding: ${theme.padding.small};
  width: 60%;
`;
