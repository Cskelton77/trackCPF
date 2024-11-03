import { IconProps } from './Icon.interface';
import { getStyles } from './Icon.style';

const Home = ({ size = 12, style, onClick }: IconProps) => {
  const styles = getStyles({ size, onClick });

  return (
    <span onClick={onClick} role="button" aria-label="Home">
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={{ ...styles, ...style }}>
        <g>
          <path d="M10 20v-6h4v6h5v-8h3l-10-9-10 9h3v8z"></path>
        </g>
      </svg>
    </span>
  );
};

export default Home;
