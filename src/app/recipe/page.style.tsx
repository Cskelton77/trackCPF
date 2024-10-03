import { theme } from '@/theme';
import styled from 'styled-components';

export const Section = styled.div`
  padding: ${theme.padding.small} 0;
`;
export const FlexSection = styled.div`
  padding: ${theme.padding.small} 0;
  display: flex;
`;
export const Table = styled.table`
  width: 100%;
  padding: ${theme.padding.medium} 0;
`;

export const InputRow = styled.tr``;

export const InputCell = styled.td`
  text-align: center;
  padding: ${theme.padding.small} 0;
`;

export const InputField = styled.input`
  width: 70%;
  height: 32px;
  font-size: ${theme.fontSize.small};
  border-radius: 12px;
  padding: ${theme.padding.small};
  text-align: right;
`;

const Action = styled.div`
  cursor: pointer;
  width: 100%;
  border: 1px solid ${theme.colours.darkGrey};
  padding: ${theme.padding.medium};
  text-align: center;

  font-size: ${theme.fontSize.small};
`;

export const Calculate = styled(Action)``;
export const Save = styled(Action)`
  background-color: ${theme.colours.positiveButton};
`;

export const ServingToggle = styled(Action)<{ $active: boolean }>`
  flex: 1;
  background: ${(props) =>
    props.$active ? theme.colours.neutralButton : theme.colours.inactiveButton};
`;
