import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Home from './page';
import mockLocalStorage from '@/mockLocalStorage';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { deleteFood, getFood } from '@/api/food';

const mockResponse: DefinedFoodObject[] = [
  {
    fid: 'MOCK_FID',
    name: 'Vegetable',
    calories: 150,
    protein: 1.5,
    fibre: 0,
    plantPoints: 1,
  },
  {
    fid: 'MOCK_FID_2',
    name: 'Non-Vegetable',
    calories: 150,
    protein: 1.5,
    fibre: 0,
    plantPoints: 0,
  },
  {
    fid: 'MOCK_FID_3',
    name: 'Non-Vegetable 2',
    calories: 38,
    protein: 1.5,
    fibre: 0,
    plantPoints: undefined,
  },
];

jest.mock('../../../api/food', () => ({
  deleteFood: jest.fn(),
  getFood: jest.fn(() => mockResponse),
  postFood: jest.fn(() => JSON.stringify('RETURNED_FID')),
}));

describe('Food Database Page', () => {
  it('should display non-plant-point items by default', async () => {
    render(<Home />);
    expect(getFood).toHaveBeenCalled();
    const itemOne = await screen.findByText('Non-Vegetable (150 cal/100g)');
    const itemTwo = await screen.findByText('Non-Vegetable 2 (38 cal/100g)');

    expect(itemOne).toBeInTheDocument();
    expect(itemTwo).toBeInTheDocument();
  });

  it('should display plant-point items', async () => {
    render(<Home />);
    const plantPointBtn = screen.getByRole('button', {
      name: 'Plant Point Fruit & Veg Plant Point',
    });
    await userEvent.click(plantPointBtn);
    const itemOne = screen.queryByText('Non-Vegetable (150 cal/100g)');
    const itemTwo = await screen.findByText('Vegetable (150 cal/100g)');

    expect(itemOne).not.toBeInTheDocument();
    expect(itemTwo).toBeInTheDocument();
  });

  it('should delete items', async () => {
    render(<Home />);
    const itemOne = await screen.findByText('Non-Vegetable (150 cal/100g)');
    expect(itemOne).toBeInTheDocument();

    const deleteBtn = screen.getAllByRole('button', {
      name: 'Delete Item from Database',
    });
    await userEvent.click(deleteBtn[0]);
    expect(deleteFood).toHaveBeenCalledWith('MOCK_FID_2');
  });
});
