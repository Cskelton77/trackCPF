import { theme } from '@/theme';
import styled from 'styled-components';

export const SummaryTable = styled.div`
  padding: 12px 0;
  width: 100%;
  font-size: 24px;
`;

export const RingsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: ${theme.padding.medium} ${theme.padding.large};
`;

export const Ring = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChartBinder = styled.div`
  height: 75px;
  width: 75px;
`;

export const SkipWarning = styled.div`
  font-size: ${theme.fontSize.xSmall};
  text-align: center;
`;

export const FlatStats = styled.div`
  display: block;
  font-size: ${theme.fontSize.small};
  text-align: center;
  padding: ${theme.padding.small} ${theme.padding.large};
`;
