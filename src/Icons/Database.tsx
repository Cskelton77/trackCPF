import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const Database = ({ size = 12, style, onClick }: IconProps) => {
  const styles = getStyles({ size, onClick });

  return (
    <span onClick={onClick} role="button" aria-label="View Food Database">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M2 20h20v-4h-20v4zm2-3h2v2h-2v-2zm-2-13v4h20v-4h-20zm4 3h-2v-2h2v2zm-4 7h20v-4h-20v4zm2-3h2v2h-2v-2z"></path>
        </g>
      </svg>
    </span>
  );
};

export default Database;
