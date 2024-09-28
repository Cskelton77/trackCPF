import { MenuBarContainer, MenuItem } from './MenuBar.style';
import { Home, AddRecipe, Database } from '@/Icons';
import { useRouter } from 'next/navigation';

const MenuBar = () => {
  const router = useRouter();

  const handleHome = () => {
    router.push('/tracker/');
  };

  const handleAddRecipe = () => {
    // router.push('/tracker/');
    // console.log('Add');
  };

  const handleFoodDatabase = () => {
    router.push('/foodlist/');
  };

  const menuIconStyle = { color: '#000', cursor: 'pointer' };
  return (
    <MenuBarContainer>
      <MenuItem onClick={handleHome}>
        <Home size={36} style={menuIconStyle} />
      </MenuItem>
      <MenuItem>
        <AddRecipe size={36} style={menuIconStyle} />
      </MenuItem>
      <MenuItem onClick={handleFoodDatabase}>
        <Database size={36} style={menuIconStyle} />
      </MenuItem>
    </MenuBarContainer>
  );
};

export default MenuBar;
