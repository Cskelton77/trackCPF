import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import Home from './page';
import Page from '../page';

import { deleteFood, getFood, postFood } from '../../api/food';
jest.mock('../../api/food', () => ({
  deleteFood: jest.fn(),
  getFood: jest.fn(() => []),
  postFood: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: () => null,
    };
  },
}));

describe('Main tracker page', () => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
  it('In CALCULATE mode', async () => {
    render(<Home />);

    // Find search bar and search
    const searchFood = screen.getByPlaceholderText('Add a new food');
    await userEvent.type(searchFood, 'New Item');

    // Add a new item
    const addNewItem = await screen.findByText(/Add New Item \(p\/100g\)/i);
    // if (addNewItem) {
    await userEvent.click(addNewItem);
    // }

    // Find the boxes in the popup
    const servingInput = await screen.findByRole('textbox', { name: 'Amount Eaten' });
    const caloriesInput = await screen.findByRole('textbox', { name: 'Calories' });
    const proteinInput = await screen.findByRole('textbox', { name: 'Protein' });
    const fiberInput = await screen.findByRole('textbox', { name: 'Fibre' });
    const plantPointsInput = await screen.findByRole('combobox', { name: 'Plant Points:' });
    const saveButton = await screen.findByRole('button', { name: 'Save' });
    await userEvent.type(servingInput, '100');
    await userEvent.type(caloriesInput, '100');
    await userEvent.type(proteinInput, '100');
    await userEvent.type(fiberInput, '100');
    await userEvent.selectOptions(plantPointsInput, '1');
    await userEvent.click(saveButton);

    expect(deleteFood).toHaveBeenCalledWith({});
  });
});
