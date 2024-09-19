import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { AddNewItem } from '@/components';
import { AddNewItemInterface } from './AddNewItem';

import moment from 'moment';
import { ItemMode, MODES } from '@/interfaces/ItemModes';

// MANUAL = 'manual',
// CALCULATE = 'calculate',
// UPDATE = 'update',

describe('Add New Item modal - CALCULATE mode', () => {
  const mockHandleSave = jest.fn((name, serving, calories, protein, fibre, plantPoints) => null);
  const shouldNotBeClicked = { pointerEventsCheck: PointerEventsCheckLevel.Never };

  const defaultProps: AddNewItemInterface = {
    name: 'Food',
    date: moment('2024-09-11'),
    isVisible: true,
    mode: MODES.CALCULATE,
    handleSave: mockHandleSave,
    close: jest.fn(),
  };

  const renderAddNewItem = async () => {
    render(<AddNewItem {...defaultProps} />);
    const user = userEvent.setup();

    const servingInput = await screen.findByRole('textbox', { name: 'Amount Eaten' });
    const caloriesInput = await screen.findByRole('textbox', { name: 'Calories' });
    const proteinInput = await screen.findByRole('textbox', { name: 'Protein' });
    const fiberInput = await screen.findByRole('textbox', { name: 'Fibre' });
    const plantPointsInput = await screen.findByRole('combobox', { name: 'Plant Points:' });
    const saveButton = await screen.findByRole('button', { name: 'Save' });
    return {
      user,
      servingInput,
      caloriesInput,
      proteinInput,
      fiberInput,
      plantPointsInput,
      saveButton,
    };
  };

  beforeEach(function () {
    mockHandleSave.mockClear();
  });

  it('Should refuse to save with 0 serving size', async () => {
    const { saveButton } = await renderAddNewItem();

    expect(saveButton).toHaveAttribute('disabled');
    await userEvent.click(saveButton, shouldNotBeClicked);
    expect(mockHandleSave).toHaveBeenCalledTimes(0);

    // await user.type(servingInput, '100');
    // await user.type(caloriesInput, '100');
    // await user.type(proteinInput, '100');
    // await user.type(fiberInput, '100');
  });

  it('Should save a new entry to diary with only serving', async () => {
    const { servingInput, saveButton } = await renderAddNewItem();
    await userEvent.type(servingInput, '100');
    expect(saveButton).not.toHaveAttribute('disabled');
    await userEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith(defaultProps.name, 100, NaN, NaN, NaN, 0);
  });

  it('Should save to diary with only serving + calories', async () => {
    const { servingInput, caloriesInput, saveButton } = await renderAddNewItem();
    await userEvent.type(servingInput, '100');
    await userEvent.type(caloriesInput, '100');
    expect(saveButton).not.toHaveAttribute('disabled');
    await userEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith(defaultProps.name, 100, 100, NaN, NaN, 0);
  });

  it('Should save a new entry to the food database with 0 protein', async () => {
    const { servingInput, caloriesInput, proteinInput, fiberInput, saveButton } =
      await renderAddNewItem();
    await userEvent.type(servingInput, '100');
    await userEvent.type(caloriesInput, '100');
    await userEvent.type(proteinInput, '0');
    await userEvent.type(fiberInput, '100');
    expect(saveButton).not.toHaveAttribute('disabled');
    await userEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith(defaultProps.name, 100, 100, 0, 100, 0);
  });

  it('Should save a new entry to the food database with 0 fibre', async () => {
    const { servingInput, caloriesInput, proteinInput, fiberInput, saveButton } =
      await renderAddNewItem();
    await userEvent.type(servingInput, '100');
    await userEvent.type(caloriesInput, '100');
    await userEvent.type(proteinInput, '100');
    await userEvent.type(fiberInput, '0');
    expect(saveButton).not.toHaveAttribute('disabled');
    await userEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith(defaultProps.name, 100, 100, 100, 0, 0);
  });

  it('Should save a new entry to the food database with 1 plant points', async () => {
    const { servingInput, caloriesInput, proteinInput, fiberInput, plantPointsInput, saveButton } =
      await renderAddNewItem();
    await userEvent.type(servingInput, '100');
    await userEvent.type(caloriesInput, '100');
    await userEvent.type(proteinInput, '100');
    await userEvent.type(fiberInput, '100');
    await userEvent.selectOptions(plantPointsInput, '1');

    expect(saveButton).not.toHaveAttribute('disabled');
    await userEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith(defaultProps.name, 100, 100, 100, 100, 1);
  });

  test('Should refuse to save with 0 calories', () => {});
});
