import { theme } from '@/theme';
import styled from 'styled-components';

export const MenuBarContainer = styled.div`
  position: sticky;
  height: 60px;
  border-top: 1px solid ${theme.colours.lightGrey};
  display: flex;
  justify-content: space-around;
  background-color: lightgray;
`;

export const MenuItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  cursor: pointer;
  border-left: 1px solid ${theme.colours.lightGrey};
  border-right: 1px solid ${theme.colours.lightGrey};
`;
