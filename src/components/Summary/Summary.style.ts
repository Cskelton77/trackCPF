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

export const SkipWarning = styled.td`
  font-size: ${theme.extraSmallText};
  text-align: center;
`;

export const FlatStats = styled.div`
  display: block;
  text-align: center;
  padding: ${theme.layoutPadding};
`;
