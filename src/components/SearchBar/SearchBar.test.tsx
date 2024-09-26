import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SearchBar } from '@/components';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { MODES } from '@/interfaces/ItemModes';

describe('Search Bar', () => {
  const mockSetValue = jest.fn();
  const mockAddNewItem = jest.fn();
  const mockSetSelectedFood = jest.fn();
  const mockDeleteFoodItem = jest.fn();

  const mockResponse: DefinedFoodObject[] = [
    {
      fid: 'MOCK_FID',
      name: 'Dropdown Food',
      calories: 150,
      protein: 1.5,
      fibre: 0,
      plantPoints: 1,
    },
  ];

  const defaultProps = {
    value: 'D',
    setValue: mockSetValue,
    response: mockResponse,
    addNewItem: mockAddNewItem,
    setSelectedFood: mockSetSelectedFood,
    deleteFoodItem: mockDeleteFoodItem,
  };

  const openDropdown = async () => {
    render(<SearchBar {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Add a new food');
    await userEvent.click(searchInput);
    await userEvent.type(searchInput, 'D');
    return { searchInput };
  };
  it('renders default values (p/100g and p/serving', async () => {
    await openDropdown();

    await screen.findByText('Add D (p/100g)');
    await screen.findByText('Add D (p/serving)');
  });

  it('renders returned search values in the dropdown', async () => {
    await openDropdown();

    await screen.findByText('Dropdown Food (150 cal/100g)');
  });

  it('closes the dropdown when focus is lost', async () => {
    const { searchInput } = await openDropdown();

    await screen.findByText('Dropdown Food (150 cal/100g)');
    // await userEvent.type(searchInput, 'a[Tab]');
    await userEvent.tab();
    setTimeout(() => {
      const dropdown = screen.queryByText('Dropdown Food (150 cal/100g)');
      console.log('dropdown', dropdown);
      expect(dropdown).toHaveLength(0);
    }, 255);
  });

  it('adds a new item per 100g', async () => {
    await openDropdown();
    const p100g = await screen.findByText('Add D (p/100g)');
    await userEvent.click(p100g);
    expect(mockAddNewItem).toHaveBeenCalledWith(MODES.CALCULATE);
  });

  it('adds a new item per serving', async () => {
    await openDropdown();
    const pServing = await screen.findByText('Add D (p/serving)');
    await userEvent.click(pServing);
    expect(mockAddNewItem).toHaveBeenCalledWith(MODES.MANUAL);
  });

  it('adds an existing item to the diary', async () => {
    await openDropdown();
    const existingFood = await screen.findByText('Dropdown Food (150 cal/100g)');

    await userEvent.click(existingFood);
    expect(mockSetSelectedFood).toHaveBeenCalledWith(mockResponse[0]);
    expect(mockAddNewItem).toHaveBeenCalledWith(MODES.CALCULATE);
  });

  it('deletes an existing item from the database', async () => {
    await openDropdown();
    const deleteButton = await screen.findByRole('button', { name: 'Delete Item from Database' });
    await userEvent.click(deleteButton);
    expect(mockDeleteFoodItem).toHaveBeenCalledWith(mockResponse[0].fid);
  });
});
