import styled from 'styled-components';

export const NewItemModal = styled.form`
  display: flex;
  align-self: center;
  flex-direction: column;
  position: absolute;
  background-color: #fff;
  width: 100%;
  height: 100%;
  top: 0;
  padding: 25px;
  color: #000;
`;

export const ItemName = styled.div`
  align-self: center;
  border: 1px solid grey;
  padding: 12px;

`;

export const ItemAttributes = styled.div`
  align-self: center;
  padding: 12px;
  border: 1px solid grey;
`;
export const EntryBox = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  color: #000,

`;
export const AttributeInput = styled.input`
  height: 36px;
  padding: 4px;
  border-radius: 8px;
  margin-right: 12px;
`;
export const TextDisplay = styled.p`
`

export const Actions = styled.div`
  width: 50%;
  align-self: center;

  //   border: 1px solid grey;
  justify-content: space-around;
  display: flex;
`;

const Action = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid grey;
  padding: 12px;
  text-align: center;
`;
export const DiscardAction = styled(Action)`
  background-color: #ca7068;
`;

export const SaveAction = styled.button`
  background-color: #6c824e;
`;
