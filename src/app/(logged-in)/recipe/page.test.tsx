import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Home from './page';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { postDiary } from '@/api/diary';
import { postFood } from '@/api/food';
import mockLocalStorage from '@/mockLocalStorage';

const mockResponse: DefinedFoodObject[] = [
  {
    fid: 'MOCK_FID',
    name: 'Dropdown Food',
    calories: 150,
    protein: 1.5,
    fibre: 0,
    plantPoints: 0,
  },
];

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: () => null,
      replace: jest.fn(),
    };
  },
}));

jest.mock('../../../api/food', () => ({
  deleteFood: jest.fn(),
  getFood: jest.fn(() => mockResponse),
  postFood: jest.fn(() => JSON.stringify('RETURNED_FID')),
}));

jest.mock('../../../api/diary', () => ({
  postDiary: jest.fn(() => '{}'),
}));

Date.now = jest.fn(() => new Date('2024-10-05').getTime());

describe('Add a Recipe Page', () => {
  window.HTMLElement.prototype.scrollIntoView = function () {};

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
    mockLocalStorage.removeItem('ingredients');
  });

  const searchFor = async (text: string = 'D') => {
    const searchInput = screen.getByPlaceholderText('Add an ingredient');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, text);
  };
  const searchForAndAddNewFood = async (text: string) => {
    await searchFor(text);
    const newFood = await screen.findByText(`Add ${text} (p/100g)`);
    await userEvent.click(newFood);
  };
  const searchForAndAddExistingFood = async () => {
    await searchFor('D');
    const existingFood = await screen.findByText('Dropdown Food (150 cal/100g)', {
      exact: false,
    });
    await userEvent.click(existingFood);
  };

  const fillRow = async ({
    name,
    amount,
    calories,
    protein,
    fibre,
  }: {
    name: string;
    amount: string;
    calories: string;
    protein: string;
    fibre: string;
  }) => {
    const enteredFood = await screen.findByText(name);
    expect(enteredFood).toBeInTheDocument();

    const amountInput = await screen.findByRole('textbox', { name: `${name} Amount` });
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, amount);

    const caloriesInput = await screen.findByRole('textbox', { name: `${name} Calories` });
    await userEvent.clear(caloriesInput);
    await userEvent.type(caloriesInput, calories);

    const proteinInput = await screen.findByRole('textbox', { name: `${name} Protein` });
    await userEvent.clear(proteinInput);
    await userEvent.type(proteinInput, protein);

    const fibreInput = await screen.findByRole('textbox', { name: `${name} Fibre` });
    await userEvent.clear(fibreInput);
    await userEvent.type(fibreInput, fibre);
  };

  const enterServingAndCalculate = async (serving: number) => {
    const isServing = serving < 50;
    if (isServing) {
      const perServing = await screen.findByRole('button', { name: 'Per Serving' });
      await userEvent.click(perServing);
    } else {
      const perServing = await screen.findByRole('button', { name: 'Per 100g' });
      await userEvent.click(perServing);
    }

    const buttonText = `Recipe ${isServing ? 'Servings' : 'Cooked Weight'}`;

    const servingInput = await screen.findByRole('textbox', { name: buttonText });
    await userEvent.clear(servingInput);
    await userEvent.type(servingInput, serving.toString());

    const calculateRecipe = await screen.findByRole('button', { name: 'Calculate Recipe' });
    await userEvent.click(calculateRecipe);
  };

  it('Should add an ingredient from the database to the recipe', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddExistingFood();
    const enteredFood = await screen.findByText('Dropdown Food');
    expect(enteredFood).toBeInTheDocument();
  });

  it('Should add a new ingredient to the recipe', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddNewFood('New Item');
    const enteredFood = await screen.findByText('New Item');
    expect(enteredFood).toBeInTheDocument();
  });

  it('Should add two ingredients to a recipe', async () => {
    // This is more of a unit-test-test since this functionality is
    // covered by the previous two tests separately
    render(<Home searchParams={{}} />);
    await searchForAndAddExistingFood();
    const existingFood = await screen.findByText('Dropdown Food');
    expect(existingFood).toBeInTheDocument();

    await searchForAndAddNewFood('New Item');
    const newFood = await screen.findByText('New Item');
    expect(newFood).toBeInTheDocument();

    await fillRow({
      name: 'Dropdown Food',
      amount: '100',
      calories: '100',
      protein: '4',
      fibre: '2',
    });

    await fillRow({
      name: 'New Item',
      amount: '100',
      calories: '160',
      protein: '8',
      fibre: '6',
    });
  });

  it('Should calculate the recipe per serving', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddNewFood('Apples');

    await fillRow({
      name: 'Apples',
      amount: '100',
      calories: '100',
      protein: '5',
      fibre: '10',
    });

    await enterServingAndCalculate(2);

    const recipeCalories = await screen.findByText('50');
    const recipeProtein = await screen.findByText('2.5');
    const recipeFibre = await screen.findByText('5');
    expect(recipeCalories).toBeInTheDocument();
    expect(recipeProtein).toBeInTheDocument();
    expect(recipeFibre).toBeInTheDocument();
  });

  it('Should calculate recipe per 100g', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddNewFood('New Item');
    await fillRow({
      name: 'New Item',
      amount: '200',
      calories: '185',
      protein: '4.2',
      fibre: '2.5',
    });

    await enterServingAndCalculate(400);

    const recipeCalories = await screen.findByText('92.5');
    const recipeProtein = await screen.findByText('2.1');
    const recipeFibre = await screen.findByText('1.25');
    expect(recipeCalories).toBeInTheDocument();
    expect(recipeProtein).toBeInTheDocument();
    expect(recipeFibre).toBeInTheDocument();
  });

  it('Should be able to recalculate', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddNewFood('New Item');
    await fillRow({
      name: 'New Item',
      amount: '100',
      calories: '175',
      protein: '3.2',
      fibre: '1.9',
    });

    await enterServingAndCalculate(100);

    const recipeCalories = await screen.findByText('175');
    const recipeProtein = await screen.findByText('3.2');
    const recipeFibre = await screen.findByText('1.9');
    expect(recipeCalories).toBeInTheDocument();
    expect(recipeProtein).toBeInTheDocument();
    expect(recipeFibre).toBeInTheDocument();

    await fillRow({
      name: 'New Item',
      amount: '100',
      calories: '200',
      protein: '5',
      fibre: '2',
    });

    const recalculateButton = await screen.findByRole('button', { name: 'Recalculate Recipe' });
    await userEvent.click(recalculateButton);

    const recalcCalories = await screen.findByText('200');
    const recalcProtein = await screen.findByText('5');
    const recalcFibre = await screen.findByText('2');
    expect(recalcCalories).toBeInTheDocument();
    expect(recalcProtein).toBeInTheDocument();
    expect(recalcFibre).toBeInTheDocument();
  });

  it('Should save recipe to diary', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddExistingFood();
    await fillRow({
      name: 'Dropdown Food',
      amount: '100',
      calories: '150',
      protein: '1.5',
      fibre: '0',
    });

    await enterServingAndCalculate(100);
    const saveButton = await screen.findByRole('button', { name: 'Save to Diary on Oct 5th' });
    await userEvent.click(saveButton);

    expect(postDiary).toHaveBeenCalledWith({
      uid: 'error',
      date: '2024-10-05',
      serving: 100,
      isDirectEntry: false,
      isRecipe: true,
      foodEntry: {
        fid: expect.any(String),
        name: 'Custom Recipe',
        calories: 150,
        protein: 1.5,
        fibre: 0,
        plantPoints: 0,
      },
      ingredients: [
        {
          amount: '100',
          calories: '150',
          fibre: '0',
          fid: 'MOCK_FID',
          name: 'Dropdown Food',
          protein: '1.5',
          plantPoints: '0',
          rid: expect.any(String),
        },
      ],
    });
  });

  it('Should save new recipe ingredients to food DB', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddExistingFood();
    await searchForAndAddNewFood('Banana');
    await fillRow({
      name: 'Dropdown Food',
      amount: '100',
      calories: '150',
      protein: '1.5',
      fibre: '0',
    });
    await fillRow({
      name: 'Banana',
      amount: '100',
      calories: '40',
      protein: '4',
      fibre: '8',
    });

    await enterServingAndCalculate(100);
    const saveButton = await screen.findByRole('button', { name: 'Save to Diary on Oct 5th' });
    await userEvent.click(saveButton);

    expect(postDiary).toHaveBeenCalledWith({
      uid: 'error',
      date: '2024-10-05',
      serving: 100,
      isDirectEntry: false,
      isRecipe: true,
      foodEntry: {
        fid: expect.any(String),
        name: 'Custom Recipe',
        calories: 190,
        protein: 5.5,
        fibre: 8,
        plantPoints: 0,
      },
      ingredients: [
        {
          amount: '100',
          calories: '150',
          fibre: '0',
          fid: 'MOCK_FID',
          name: 'Dropdown Food',
          protein: '1.5',
          rid: expect.any(String),
          plantPoints: '0',
        },
        {
          amount: '100',
          calories: '40',
          fibre: '8',
          fid: 'RETURNED_FID',
          name: 'Banana',
          protein: '4',
          rid: expect.any(String),
          plantPoints: '0',
        },
      ],
    });

    expect(postFood).toHaveBeenCalledWith({
      uid: 'error',
      name: 'Banana',
      calories: 40,
      protein: 4,
      fibre: 8,
      plantPoints: 0,
    });
  });

  it('Should load a recipe from localstorage', async () => {
    const testRecipe = {
      recipeName: 'Test Recipe Name',
      servingDivisor: '100',
      servingAmount: '120',
      ingredients: [
        {
          rid: '',
          fid: '',
          name: 'Test Ingredient',
          amount: 12,
          calories: 123,
          protein: 1.3,
          fibre: 0,
        },
      ],
    };

    mockLocalStorage.setItem('ingredients', JSON.stringify(testRecipe));

    render(<Home searchParams={{}} />);

    const recipeName = await screen.findByLabelText('Name of recipe');
    expect(recipeName).toHaveValue('Test Recipe Name');
    const ingredientName = await screen.findByText('Test Ingredient');
    expect(ingredientName).toBeInTheDocument();
  });

  it('Should load a recipe from URL', async () => {
    const testRecipe = {
      recipeName: 'Test Recipe From URL',
      servingDivisor: '100',
      servingAmount: '120',
      ingredients: [
        {
          rid: '',
          fid: '',
          name: 'Test URL Ingredient',
          amount: 12,
          calories: 123,
          protein: 1.3,
          fibre: 0,
        },
      ],
    };
    const urlToken = Buffer.from(JSON.stringify(testRecipe)).toString('base64');
    render(<Home searchParams={{ shared: urlToken }} />);

    const recipeName = await screen.findByLabelText('Name of recipe');
    expect(recipeName).toHaveValue('Test Recipe From URL');
    const ingredientName = await screen.findByText('Test URL Ingredient');
    expect(ingredientName).toBeInTheDocument();
  });

  it('Should not crash with junk share URL', async () => {
    render(<Home searchParams={{ shared: '35g42fq3g4gq354gtrwsg34q' }} />);

    const recipeName = await screen.findByLabelText('Name of recipe');
    expect(recipeName).toHaveValue('');
  });

  it('URL share takes priority over localStorage', async () => {
    const testRecipe = {
      recipeName: 'Test Recipe Name',
      servingDivisor: '100',
      servingAmount: '120',
      ingredients: [
        {
          rid: '',
          fid: '',
          name: 'Test Ingredient',
          amount: 12,
          calories: 123,
          protein: 1.3,
          fibre: 0,
        },
      ],
    };

    mockLocalStorage.setItem('ingredients', JSON.stringify(testRecipe));

    const testRecipeUrl = {
      recipeName: 'Test Recipe From URL',
      servingDivisor: '100',
      servingAmount: '120',
      ingredients: [
        {
          rid: '',
          fid: '',
          name: 'Test URL Ingredient',
          amount: 12,
          calories: 123,
          protein: 1.3,
          fibre: 0,
        },
      ],
    };
    const urlToken = Buffer.from(JSON.stringify(testRecipeUrl)).toString('base64');
    render(<Home searchParams={{ shared: urlToken }} />);

    const recipeName = await screen.findByLabelText('Name of recipe');
    expect(recipeName).toHaveValue('Test Recipe From URL');

    const ingredientName = await screen.findByText('Test URL Ingredient');
    expect(ingredientName).toBeInTheDocument();
  });

  it('Should copy decryptable URL to clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<Home searchParams={{}} />);
    await searchForAndAddExistingFood();
    await fillRow({
      name: 'Dropdown Food',
      amount: '100',
      calories: '150',
      protein: '1.5',
      fibre: '0',
    });

    await enterServingAndCalculate(100);
    const shareBtn = await screen.findByText('Share Recipe');
    expect(shareBtn).toBeInTheDocument();

    await userEvent.click(shareBtn);
    setTimeout(async () => {
      const shareBtn2 = await screen.findByText('Copied to Clipboard...');
      expect(shareBtn2).toBeInTheDocument();
    }, 50);

    setTimeout(async () => {
      const shareBtn3 = await screen.findByText('Share Recipe');
      expect(shareBtn3).toBeInTheDocument();
    }, 1550);
  });

  it('Should remove an item from ingredients array', async () => {
    render(<Home searchParams={{}} />);
    await searchForAndAddExistingFood();
    await fillRow({
      name: 'Dropdown Food',
      amount: '100',
      calories: '150',
      protein: '1.5',
      fibre: '0',
    });

    const deleteBtn = await screen.findByRole('button', { name: 'Delete Dropdown Food' });
    await userEvent.click(deleteBtn);
    const enteredFood = screen.queryByText('Dropdown Food');
    expect(enteredFood).not.toBeInTheDocument();
  });
});

// untested lines
// 94-95 Calculating recipe with incomplete data (This should just be disabled as an option ?)
// 158-159 Rounding checks
// 161 more rounding logic
