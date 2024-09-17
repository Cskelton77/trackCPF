import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { AddNewItem } from '@/components';
import { AddNewItemInterface } from './AddNewItem';

import moment from 'moment';
import { ItemMode, MODES } from '@/interfaces/ItemModes';

// MANUAL = 'manual',
// CALCULATE = 'calculate',
// UPDATE = 'update',

describe('Add New Item modal - CALCULATE mode', () => {
  const defaultProps: AddNewItemInterface = {
    name: 'Food',
    date: moment('2024-09-11'),
    isVisible: true,
    mode: MODES.CALCULATE,
    handleSave: jest.fn(),
    close: jest.fn(),
  };
  const renderAddNewItem = async () => {
    render(<AddNewItem {...defaultProps} />);
    const user = userEvent.setup();

    const servingInput = await screen.findByRole('textbox', { name: 'Amount Eaten' });
    const caloriesInput = await screen.findByRole('textbox', { name: 'Calories' });
    const proteinInput = await screen.findByRole('textbox', { name: 'Protein' });
    const fiberInput = await screen.findByRole('textbox', { name: 'Fibre' });

    return {
      user,
      servingInput,
      caloriesInput,
      proteinInput,
      fiberInput,
    };
  };
  it.only('Should refuse to save with 0 serving size', async () => {
    const { user } = await renderAddNewItem();

    // await user.type(servingInput, '100');
    // await user.type(caloriesInput, '100');
    // await user.type(proteinInput, '100');
    // await user.type(fiberInput, '100');
  });

  test('Should save to diary with calories + nothing', () => {});

  test('Should save a new entry to the food database with 0 protein', () => {});
  test('Should save a new entry to the food database with 0 fibre', () => {});
  test('Should save a new entry to the food database with 0 plant points', () => {});

  test('Should save a new entry to the food database with 1 plant point', () => {});

  test('Should refuse to save with 0 calories', () => {});
});
