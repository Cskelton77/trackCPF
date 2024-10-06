import styled from 'styled-components';
import { theme } from '@/theme';

export const PersonalInfo = styled.div`
  padding: ${theme.padding.large} 0;
`;
export const SettingsSection = styled.div`
  padding: ${theme.padding.small} 0;
`;

export const AppSettings = styled.div`
  padding: ${theme.padding.large} 0;
`;

export const HeightInput = styled.input`
  width: 35px;
  padding: ${theme.padding.small};
  color: ${theme.colours.black};
  background-color: ${theme.colours.white};
  border-left: none;
  border-right: none;
  border-top: none;
`;

export const WeightInput = styled.input`
  width: 50px;
  padding: ${theme.padding.small};
  color: ${theme.colours.darkGrey};
  background-color: ${theme.colours.white};
  border-left: none;
  border-right: none;
  border-top: none;
`;

export const RadioButton = styled.input`
  height: 25px;
  width: 35px;
  padding: ${theme.padding.small};
`;

export const Actions = styled.div`
  width: 65%;
  align-self: center;
  justify-content: space-around;
  display: flex;
`;

const Action = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${theme.colours.darkGrey};
  padding: ${theme.padding.small};
  text-align: center;
  flex: 1;
`;

export const DiscardAction = styled(Action)`
  background-color: #ca7068;
`;

export const SaveAction = styled.button`
  background-color: #6c824e;
  flex: 1;
  border: 1px solid ${theme.colours.darkGrey};
`;

export const VersionNumber = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  font-size: ${theme.fontSize.xSmall};
`;
