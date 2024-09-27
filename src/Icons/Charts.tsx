import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const Charts = ({ size = 12, style, onClick }: IconProps) => {
  const styles = getStyles({ size, onClick });

  return (
    <span onClick={onClick} role="button" aria-label="View Statistics">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M19 3h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm-10 14h-2v-7h2v7zm4 0h-2v-10h2v10zm4 0h-2v-4h2v4z"></path>
        </g>
      </svg>
    </span>
  );
};

export default Charts;
