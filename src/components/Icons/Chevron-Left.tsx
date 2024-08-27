import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const ChevronLeft = ({ size = 12, style, onClick }: IconProps) => {
  const styles = getStyles({ size, onClick });
  return (
    <span onClick={onClick}>
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M15.41 7.41l-1.41-1.41-6 6 6 6 1.41-1.41-4.58-4.59z"></path>
        </g>
      </svg>
    </span>
  );
};

export default ChevronLeft;
