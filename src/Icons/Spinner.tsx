import Image from 'next/image';
import spinner from '../assets/spinner.gif';

const Spinner = () => {
  return <Image src={spinner} alt="loading data" layout="responsive" />;
};

export default Spinner;
