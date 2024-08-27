import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const ChevronLeft = ({ size = 12, style, onClick }: IconProps) => {
  const styles = getStyles({ size, onClick });

  return (
    <span onClick={onClick}>
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M10 6l-1.41 1.41 4.58 4.59-4.58 4.59 1.41 1.41 6-6z"></path>
        </g>
      </svg>
    </span>
  );
};

export default ChevronLeft;
