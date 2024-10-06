import { theme } from '@/theme';
import styled from 'styled-components';

export const PageWrapper = styled.div`
  padding: 16px;
  overflow-y: scroll;
  height: 94vh;
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
