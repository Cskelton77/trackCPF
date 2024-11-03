import { theme } from '@/theme';
import styled from 'styled-components';

export const MenuBarContainer = styled.div`
  height: 4dvh;
  border-top: 1px solid ${theme.colours.lightGrey};
  display: flex;
  //   background-color: lightgray;
  box-shadow: 0px 1px 5px 0px ${theme.colours.lightGrey};
`;

export const MenuItem = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  cursor: pointer;
  text-decoration: ${(props) => (props.$selected ? 'underline' : 'auto')};
  &:first-child {
    border-right: 1px solid ${theme.colours.lightGrey};
  }
`;

export const PageWrapper = styled.div`
  padding: 16px;
  overflow-y: scroll;
  height: 92dvh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${theme.padding.small};
  border-bottom: 1px solid ${theme.colours.lightGrey};
`;

export const FoodEntry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.padding.medium};
`;

export const ActionBlock = styled.div`
  display: flex;
`;

