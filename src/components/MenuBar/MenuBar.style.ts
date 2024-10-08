import { theme } from '@/theme';
import styled from 'styled-components';

export const MenuBarContainer = styled.div`
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
  position: sticky;
  height: 8vh;
  border-top: 1px solid ${theme.colours.lightGrey};
  display: flex;
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
