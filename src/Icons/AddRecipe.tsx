import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const AddRecipe = ({ size = 12, style, onClick }: IconProps) => {
  const styles = getStyles({ size, onClick });

  return (
    <span onClick={onClick} role="button" aria-label="Add Recipe">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M14 2h-8c-1.1 0-1.99.9-1.99 2l-.01 16c0 1.1.89 2 1.99 2h12.01c1.1 0 2-.9 2-2v-12l-6-6zm2 14h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm-3-7v-5.5l5.5 5.5h-5.5z"></path>
        </g>
      </svg>
    </span>
  );
};

export default AddRecipe;
