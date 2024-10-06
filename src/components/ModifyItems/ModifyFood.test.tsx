import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ModifyFood } from '@/components';
import { ModifyFoodInterface } from './ModifyFood';
import { DefinedFoodObject } from '@/interfaces/FoodObject';

describe('Add New Item modal', () => {
  const mockHandleSave = jest.fn((food: DefinedFoodObject) => null);

  const defaultFoodObject = {
    fid: 'TEST-FID',
    name: 'Test Food',
    calories: 100,
    protein: 2,
    fibre: 1.4,
    plantPoints: 0,
  };
  const incompleteFoodObject = {
    fid: 'TEST-FID',
    name: 'Test Food',
    calories: 100,
    protein: NaN,
    fibre: 1.4,
    plantPoints: 0,
  };
  const defaultProps: ModifyFoodInterface = {
    isVisible: true,
    handleSave: mockHandleSave,
    close: jest.fn(),
  };

  const renderAddNewItem = async (food: DefinedFoodObject = defaultFoodObject) => {
    render(<ModifyFood {...defaultProps} selectedFood={food} />);
    const user = userEvent.setup();

    return { user };
  };

  const enterData = async ({
    cal,
    pro,
    fib,
    plant,
  }: {
    cal?: number;
    pro?: number;
    fib?: number;
    plant?: number;
  }) => {
    const caloriesInput = await screen.findByRole('textbox', { name: 'Calories' });
    const proteinInput = await screen.findByRole('textbox', { name: 'Protein' });
    const fiberInput = await screen.findByRole('textbox', { name: 'Fibre' });
    const plantPointsInput = await screen.findByRole('combobox', { name: 'Plant Points' });
    const saveButton = await screen.findByRole('button', { name: 'Update Entry' });

    if (typeof cal == 'number') {
      await userEvent.clear(caloriesInput);
      await userEvent.type(caloriesInput, cal.toString());
    }

    if (typeof pro == 'number') {
      await userEvent.clear(proteinInput);
      await userEvent.type(proteinInput, pro.toString());
    }
    if (typeof fib == 'number') {
      await userEvent.clear(fiberInput);
      await userEvent.type(fiberInput, fib.toString());
    }

    if (typeof plant == 'number') {
      await userEvent.selectOptions(plantPointsInput, plant.toString());
    }

    await userEvent.click(saveButton);
  };

  beforeEach(function () {
    mockHandleSave.mockClear();
  });

  it('Should update database with new info', async () => {
    await renderAddNewItem();
    await enterData({ cal: 120, pro: 2.5, fib: 1.4 });

    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith({
      fid: defaultFoodObject.fid,
      name: defaultFoodObject.name,
      calories: 120,
      protein: 2.5,
      fibre: 1.4,
      plantPoints: 0,
    });
  });

  it('Should update database with new info including 0-values', async () => {
    await renderAddNewItem();
    await enterData({ cal: 120, pro: 0, fib: 1.4 });

    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith({
      fid: defaultFoodObject.fid,
      name: defaultFoodObject.name,
      calories: 120,
      protein: 0,
      fibre: 1.4,
      plantPoints: 0,
    });
  });

  it('Should update database from incomplete starting data', async () => {
    await renderAddNewItem(incompleteFoodObject);
    await enterData({ cal: 120, pro: 2.5, fib: 1.4 });

    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith({
      fid: defaultFoodObject.fid,
      name: defaultFoodObject.name,
      calories: 120,
      protein: 2.5,
      fibre: 1.4,
      plantPoints: 0,
    });
  });

  it('Should update database entry with info removed', async () => {
    await renderAddNewItem();

    const proteinInput = await screen.findByRole('textbox', { name: 'Protein' });
    await userEvent.clear(proteinInput);

    const saveButton = await screen.findByRole('button', { name: 'Update Entry' });
    await userEvent.click(saveButton);

    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith({
      fid: defaultFoodObject.fid,
      name: defaultFoodObject.name,
      calories: defaultFoodObject.calories,
      protein: NaN,
      fibre: defaultFoodObject.fibre,
      plantPoints: defaultFoodObject.plantPoints,
    });
  });

  it('Should save to diary with 1 plant points', async () => {
    await renderAddNewItem();
    await enterData({ plant: 1 });

    expect(mockHandleSave).toHaveBeenCalledTimes(1);
    expect(mockHandleSave).toHaveBeenCalledWith({
      fid: defaultFoodObject.fid,
      name: defaultFoodObject.name,
      calories: defaultFoodObject.calories,
      protein: defaultFoodObject.protein,
      fibre: defaultFoodObject.fibre,
      plantPoints: 1,
    });
  });
});
