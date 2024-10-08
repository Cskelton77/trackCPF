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
  font-size: ${theme.fontSize.xSmall};
  width: 20%;
`;

export const InputField = styled.input`
  width: 85%;
  height: 32px;
  font-size: ${theme.fontSize.small};
  border-radius: 12px;
  padding: ${theme.padding.small};
  text-align: right;
`;

const Action = styled.div`
  cursor: pointer;
  color: ${theme.colours.white};
  width: 100%;
  border: 1px solid ${theme.colours.darkGrey};
  padding: ${theme.padding.medium};
  text-align: center;

  font-size: ${theme.fontSize.small};
`;

export const Calculate = styled(Action)<{ $disabled: boolean }>`
  cursor: ${({ $disabled }) => ($disabled ? 'auto' : 'pointer')};
  background: ${({ $disabled }) =>
    $disabled ? theme.colours.inactiveButton : theme.colours.neutralButton};
  color: ${({ $disabled }) => ($disabled ? theme.colours.lightGrey : theme.colours.white)};
`;

export const Save = styled(Action)`
  background-color: ${theme.colours.positiveButton};
`;

export const ServingLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 2;
  padding: ${theme.padding.medium};
  text-align: right;
`;
export const FlexInputField = styled(InputField)`
  flex: 1;
  height: auto;
`;
export const ServingToggle = styled(Action)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;
  background: ${(props) => (props.$active ? theme.colours.neutralButton : 'auto')};
  color: ${(props) => (props.$active ? theme.colours.white : theme.colours.darkGrey)};
`;
