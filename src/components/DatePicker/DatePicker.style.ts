import styled from 'styled-components';
import { theme } from '@/theme';

export const DatePickerWrapper = styled.div`
  padding: ${theme.padding.large} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DateSelector = styled.div<{ $compact: boolean }>`
  font-size: ${(props) => (props.$compact ? theme.fontSize.medium : theme.fontSize.large)};
`;

export const Day = styled.div`
  font-size: ${theme.fontSize.medium};
`;

export const YearWrapper = styled.div`
  font-size: ${theme.fontSize.medium};
`;
