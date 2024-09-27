import styled from 'styled-components';
import { theme } from '@/theme';

export const DatePickerWrapper = styled.div`
  padding-top: ${theme.padding.large};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DateSelector = styled.div`
  font-size: ${theme.fontSize.large};
`;

export const Day = styled.div`
  font-size: ${theme.fontSize.medium};
`;

export const YearWrapper = styled.div`
  font-size: ${theme.fontSize.medium};
`;
