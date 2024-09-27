import { theme } from '@/theme';
import styled from 'styled-components';

export const SearchBarInput = styled.input`
  width: 100%;
  height: 36px;
  font-size: ${theme.fontSize.medium};
  border-radius: 12px;
  padding: ${theme.padding.small};
`;

export const ResponseDropdown = styled.div`
  margin: 0 auto;
  width: 85%;
`;

export const ResponseRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: 'pointer';
  width: 100%;
  font-size: ${theme.fontSize.small};
  padding: ${theme.padding.small};
  color: ${theme.colours.black};
  background-color: ${theme.colours.lightGrey};
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
`;

export const ActionBlock = styled.div`
  display: flex;
`;
