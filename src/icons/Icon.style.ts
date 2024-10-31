import { IconProps } from './Icon.interface';

export const getStyles = ({ onClick, size }: IconProps) => ({
  fill: 'currentcolor',
  cursor: onClick ? 'pointer' : 'default',
  verticalAlign: 'middle',
  width: size,
  height: size,
});
