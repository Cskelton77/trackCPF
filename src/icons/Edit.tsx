import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const Edit = ({ size = 12, style, onClick, label }: IconProps) => {
  const styles = getStyles({ size, onClick });

  return (
    <span onClick={onClick} role="button" aria-label={label}>
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M3 17.25v3.75h3.75l11.06-11.06-3.75-3.75-11.06 11.06zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
        </g>
      </svg>
    </span>
  );
};

export default Edit;
