import { theme } from '@/theme';
import styled from 'styled-components';

export const MainDisplayTable = styled.table`
  width: 100%;
  text-align: left;
  padding: 25px 0;
`;

export const TableCell = styled.td`
  padding: ${theme.padding.small};
  border-bottom: 1px solid #e0e0e0;
`;

export const IngredientRow = styled.tr`
  font-size: ${theme.fontSize.xSmall};
`;
export const IndentedTableCell = styled.td`
  //   text-align: right;
  padding: 5px 0;
  padding-left: ${theme.padding.large};
  border-bottom: 1px solid #e0e0e0;
`;

export const NumberHeader = styled.th`
  text-align: right;
`;

export const NumberCell = styled(TableCell)`
  text-align: right;
`;
