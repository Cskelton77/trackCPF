import styled from 'styled-components';
import { theme } from '@/theme';
export const LoginHeader = styled.h1`
  text-align: center;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const EmailForm = styled.input`
  height: 36px;
  padding: ${theme.padding.small};
  margin: ${theme.padding.large};
`;

export const LoginButton = styled.button`
  margin: 0 24px;
  height: 48px;
`;