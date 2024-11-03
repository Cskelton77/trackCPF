import Image from 'next/image';
import recipe from '../assets/recipe.png';

const Recipe = () => {
  return <Image src={recipe} alt="loading data" style={{ height: '12px', width: '12px' }} />;
};

export default Recipe;
