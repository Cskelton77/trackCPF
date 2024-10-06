import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import Home from './page';
import { GENDER, PROTEIN_CALCULATION, UserContext } from '@/context';
import { postFood } from '../../api/food';
import { postDiary, updateDiary } from '../../api/diary';
import { MODES, NullableNumber } from '@/interfaces/ItemModes';
import moment from 'moment';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '0000-1111-2222-3333'),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: () => null,
    };
  },
}));

jest.mock('../../api/food', () => ({
  deleteFood: jest.fn(),
  getFood: jest.fn(() => [
    {
      fid: 'TEST_FID',
      name: 'TEST EXISTING FOOD',
      calories: 1234,
      protein: 1.5,
      fibre: 0.9,
      plantPoints: 1,
    },
  ]),
  postFood: jest.fn(() => '{}'),
}));

jest.mock('../../api/diary', () => ({
  deleteDiary: jest.fn(),
  getDiary: jest.fn(() => {
    return new Promise((resolve) => {
      resolve({
        dailyData: [
          {
            did: 'TEST_DID',
            uid: 'TEST_UID',
            date: '2024-09-22',
            serving: '100',
            isDirectEntry: false,
            foodEntry: {
              fid: 'TEST_FID',
              name: 'New Food Item',
              calories: '100',
              protein: '100',
              fibre: '100',
              plantPoints: '1',
            },
          },
          {
            did: 'TEST_DID2',
            uid: 'TEST_UID2',
            date: '2024-09-23',
            serving: '1',
            isDirectEntry: true,
            foodEntry: {
              fid: 'TEST_FID2',
              name: 'Serving Food Item',
              calories: '263',
              protein: '1.9',
              fibre: '0.4',
              plantPoints: '1',
            },
          },
        ],
      });
    });
  }),
  postDiary: jest.fn(() => '{}'),
  updateDiary: jest.fn(() => '{}'),
}));

jest.mock('../../api/users/settings', () => ({
  getSettings: jest.fn(() => {
    return new Promise((resolve) => {
      resolve({
        gender: GENDER.MALE,
        age: 32,
        heightFeet: 5,
        heightInches: 2,
        weight: 150,
        protein: PROTEIN_CALCULATION.AGGRESSIVE,
        rounding: false,
        usePlantPoints: true,
      });
    });
  }),
  default: () => jest.fn(),
}));

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  DatePicker: jest.fn(() => '{}'),
  Summary: jest.fn(() => '{}'),
  Settings: jest.fn(() => '{}'),
}));

interface args {
  serving: number;
  calories: NullableNumber;
  protein: NullableNumber;
  fibre: NullableNumber;
  plantPoints: NullableNumber;
}

describe('Main tracker page', () => {
  // Mock scrollTo
  window.HTMLElement.prototype.scrollIntoView = function () {};

  const fillOutForm = async ({
    serving,
    calories,
    protein,
    fibre,
    plantPoints,
    mode,
  }: args & { mode: MODES }) => {
    const saveText = mode === MODES.UPDATE ? 'Update Entry' : 'Save';

    const servingInput = await screen.findByRole('textbox', { name: 'Portion:' });
    const caloriesInput = await screen.findByRole('textbox', { name: 'Calories' });
    const proteinInput = await screen.findByRole('textbox', { name: 'Protein' });
    const fiberInput = await screen.findByRole('textbox', { name: 'Fibre' });
    const plantPointsInput = await screen.findByRole('combobox', { name: 'Plant Points' });
    const saveButton = await screen.findByRole('button', { name: saveText });

    await userEvent.clear(servingInput);
    await userEvent.clear(caloriesInput);
    await userEvent.clear(proteinInput);
    await userEvent.clear(fiberInput);

    await userEvent.type(servingInput, serving.toString());

    if (typeof calories === 'number') {
      await userEvent.type(caloriesInput, calories.toString());
    }
    if (typeof protein === 'number') {
      await userEvent.type(proteinInput, protein.toString());
    }
    if (typeof fibre === 'number') {
      await userEvent.type(fiberInput, fibre.toString());
    }
    await userEvent.selectOptions(plantPointsInput, (plantPoints || 0).toString());

    await userEvent.click(saveButton);
  };

  describe('Update an item in the food diary (Update Mode)', () => {
    const renderAndOpenUpdateWindow = async () => {
      render(
        <UserContext.Provider value={'TEST_UID'}>
          <Home />
        </UserContext.Provider>,
      );
      const foodDiaryItem = await screen.findByText('New Food Item', { exact: false });
      await userEvent.click(foodDiaryItem);
    };

    const fillOutUpdateForm = async ({ serving, calories, protein, fibre, plantPoints }: args) => {
      await fillOutForm({
        serving,
        calories,
        protein,
        fibre,
        plantPoints,
        mode: MODES.UPDATE,
      });
    };

    const assertCorrectCalls = async ({ serving, calories, protein, fibre, plantPoints }: args) => {
      expect(postFood).not.toHaveBeenCalled();
      expect(updateDiary).toHaveBeenCalledWith({
        did: 'TEST_DID',
        uid: 'TEST_UID',
        serving: serving,
        foodEntry: {
          fid: 'TEST_FID',
          name: 'New Food Item',
          calories,
          protein,
          fibre,
          plantPoints,
        },
      });
    };

    it('With a full dataset', async () => {
      await renderAndOpenUpdateWindow();

      const serving = 100;
      const calories = 100;
      const protein = 100;
      const fibre = 100;
      const plantPoints = 1;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });

    it('With only serving data', async () => {
      await renderAndOpenUpdateWindow();

      const serving = 50;
      const calories = NaN;
      const protein = NaN;
      const fibre = NaN;
      const plantPoints = 0;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });

    it('With no calories information', async () => {
      await renderAndOpenUpdateWindow();
      const serving = 50;
      const calories = NaN;
      const protein = 49;
      const fibre = 2.4;
      const plantPoints = 1;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });

    it('With no protein information', async () => {
      await renderAndOpenUpdateWindow();

      const serving = 50;
      const calories = 400;
      const protein = NaN;
      const fibre = 2.4;
      const plantPoints = 1;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });

    it('With no fibre information', async () => {
      await renderAndOpenUpdateWindow();

      const serving = 23;
      const calories = 526;
      const protein = 4.1;
      const fibre = NaN;
      const plantPoints = 1;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });

    it('With 0 fibre', async () => {
      await renderAndOpenUpdateWindow();

      const serving = 23;
      const calories = 526;
      const protein = 4.1;
      const fibre = 0;
      const plantPoints = 1;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });

    it('With 0 protein', async () => {
      await renderAndOpenUpdateWindow();

      const serving = 20;
      const calories = 56;
      const protein = 0;
      const fibre = 1.3;
      const plantPoints = 1;

      await fillOutUpdateForm({ serving, calories, protein, fibre, plantPoints });
      await assertCorrectCalls({ serving, calories, protein, fibre, plantPoints });
    });
  });

  describe('Add a new food to the diary (Calculate Mode [New])', () => {
    const renderAndSearchNewFood = async () => {
      render(
        <UserContext.Provider value={'TEST_UID'}>
          <Home />
        </UserContext.Provider>,
      );
      const searchFood = await screen.findByPlaceholderText('Add a new food');
      await userEvent.type(searchFood, 'New Item');
    };

    const enterFoodInfo = async ({ serving, calories, protein, fibre, plantPoints }: args) => {
      const addNewItem = await screen.findByText(/Add New Item \(p\/100g\)/i);
      await userEvent.click(addNewItem);
      await fillOutForm({ serving, calories, protein, fibre, plantPoints, mode: MODES.CALCULATE });
    };

    const expectPostFood = ({ serving, calories, protein, fibre, plantPoints }: args) => {
      expect(postFood).toHaveBeenCalledWith({
        uid: 'TEST_UID',
        name: 'New Item',
        calories: calories,
        protein: protein,
        fibre: fibre,
        plantPoints: plantPoints,
      });
    };

    const expectPostDiary = ({ serving, calories, protein, fibre, plantPoints }: args) => {
      const isCompleteEntry =
        !Number.isNaN(calories) && !Number.isNaN(protein) && !Number.isNaN(fibre);
      expect(postDiary).toHaveBeenCalledWith({
        uid: 'TEST_UID',
        date: moment().format('YYYY-MM-DD'),
        serving: serving,
        isDirectEntry: false,
        foodEntry: {
          fid: isCompleteEntry ? '' : '0000-1111-2222-3333',
          name: 'New Item',
          calories: calories,
          protein: protein,
          fibre: fibre,
          plantPoints: plantPoints,
        },
      });
    };

    it('Saves to diary + db with full nutrition information', async () => {
      await renderAndSearchNewFood();

      const serving = 100;
      const calories = 234;
      const protein = 6.1;
      const fibre = 0.9;
      const plantPoints = 1;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expectPostFood({ serving, calories, protein, fibre, plantPoints });
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary + db with 0 fibre', async () => {
      await renderAndSearchNewFood();

      const serving = 499;
      const calories = 2;
      const protein = 42;
      const fibre = 0;
      const plantPoints = 1;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expectPostFood({ serving, calories, protein, fibre, plantPoints });
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary + db with 0 protein', async () => {
      await renderAndSearchNewFood();

      const serving = 499;
      const calories = 2;
      const protein = 0;
      const fibre = 0.1;
      const plantPoints = 1;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expectPostFood({ serving, calories, protein, fibre, plantPoints });
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary + db  with plant points', async () => {
      await renderAndSearchNewFood();

      const serving = 499;
      const calories = 2;
      const protein = 42;
      const fibre = 3;
      const plantPoints = 1;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expectPostFood({ serving, calories, protein, fibre, plantPoints });
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary, not db with only serving data', async () => {
      await renderAndSearchNewFood();

      const serving = 100;
      const calories = NaN;
      const protein = NaN;
      const fibre = NaN;
      const plantPoints = 0;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expect(postFood).not.toHaveBeenCalled();
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary, not db with no calorie data', async () => {
      await renderAndSearchNewFood();

      const serving = 100;
      const calories = NaN;
      const protein = 3.2;
      const fibre = 26;
      const plantPoints = 0;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expect(postFood).not.toHaveBeenCalled();
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary, not db with no protein data', async () => {
      await renderAndSearchNewFood();

      const serving = 499;
      const calories = 2;
      const protein = NaN;
      const fibre = 3;
      const plantPoints = 0;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expect(postFood).not.toHaveBeenCalled();
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('Saves to diary, not db with no fibre data entered', async () => {
      await renderAndSearchNewFood();

      const serving = 499;
      const calories = 2;
      const protein = 4.22;
      const fibre = NaN;
      const plantPoints = 0;

      await enterFoodInfo({ serving, calories, protein, fibre, plantPoints });
      expect(postFood).not.toHaveBeenCalled();
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });
  });

  describe('Add an existing food to the diary (Calculate Mode [Existing]}', () => {
    const renderAndFindExistingFood = async () => {
      render(
        <UserContext.Provider value={'TEST_UID'}>
          <Home />
        </UserContext.Provider>,
      );
      const searchFood = await screen.findByPlaceholderText('Add a new food');
      await userEvent.type(searchFood, 'New Item');
      const existingFood = screen.getByText('TEST EXISTING FOOD', { exact: false });
      await userEvent.click(existingFood);
    };

    const enterFoodInfo = async (serving: number) => {
      const servingInput = await screen.findByRole('textbox', { name: 'Portion:' });
      const saveButton = await screen.findByRole('button', { name: 'Save' });
      await userEvent.type(servingInput, serving.toString());
      await userEvent.click(saveButton);
    };

    const expectPostDiary = (serving: number) => {
      expect(postDiary).toHaveBeenCalledWith({
        uid: 'TEST_UID',
        date: moment().format('YYYY-MM-DD'),
        serving: serving,
        isDirectEntry: false,
        foodEntry: {
          fid: 'TEST_FID',
          name: 'TEST EXISTING FOOD',
          calories: 1234,
          protein: 1.5,
          fibre: 0.9,
          plantPoints: 1,
        },
      });
    };

    it('should find an existing food in the dropdown and save it to the diary', async () => {
      await renderAndFindExistingFood();

      const serving = 100;

      await enterFoodInfo(serving);
      expect(postFood).not.toHaveBeenCalled();
      expectPostDiary(serving);
    });
  });

  describe('Add a one-off food per serving (Manual Mode)', () => {
    const renderAndSearchNewFood = async () => {
      render(
        <UserContext.Provider value={'TEST_UID'}>
          <Home />
        </UserContext.Provider>,
      );
      const searchFood = await screen.findByPlaceholderText('Add a new food');
      await userEvent.type(searchFood, 'New Serving Food');
    };

    const expectPostDiary = ({ serving, calories, protein, fibre, plantPoints }: args) => {
      expect(postDiary).toHaveBeenCalledWith({
        uid: 'TEST_UID',
        date: moment().format('YYYY-MM-DD'),
        serving: serving,
        isDirectEntry: true,
        foodEntry: {
          fid: '0000-1111-2222-3333',
          name: 'New Serving Food',
          calories: calories,
          protein: protein,
          fibre: fibre,
          plantPoints: plantPoints,
        },
      });
    };

    it('should save a per-serving food to the diary', async () => {
      await renderAndSearchNewFood();

      const serving = 1;
      const calories = 240;
      const protein = 4.9;
      const fibre = 3;
      const plantPoints = 0;

      const addNewItem = await screen.findByText(/Add New Serving Food \(p\/serving\)/i);
      await userEvent.click(addNewItem);
      await fillOutForm({ serving, calories, protein, fibre, plantPoints, mode: MODES.MANUAL });

      expect(postFood).not.toHaveBeenCalled();
      expectPostDiary({ serving, calories, protein, fibre, plantPoints });
    });

    it('should not let a per-serving food be edited', async () => {
      const shouldNotBeClicked = { pointerEventsCheck: PointerEventsCheckLevel.Never };
      render(
        <UserContext.Provider value={'TEST_UID'}>
          <Home />
        </UserContext.Provider>,
      );
      const foodDiaryItem = await screen.findByText('Serving Food Item', { exact: false });
      await userEvent.click(foodDiaryItem, shouldNotBeClicked);
    });
  });
});

// Untested Lines/Flows
// 80-81 => Log out if UID is error
// 87 => Log out if UID is error
// 203-205 => Delete diary entries
// 208-210 => Delete database entries
// 214-215 => Open Settings
// 217-219 => Close settings
// 221-224 => Log Out
