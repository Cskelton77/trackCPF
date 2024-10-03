'use client';
import { useContext, useEffect, useState } from 'react';
import { DatePicker, SearchBar } from '@/components';
import { SettingsContext, UserContext } from '@/context';
import {
  Table,
  InputCell,
  InputRow,
  InputField,
  Section,
  Save,
  Calculate,
  FlexSection,
  ServingToggle,
} from './page.style';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { v4 as uuidv4 } from 'uuid';
import { postFood } from '@/api/food';
import { DiaryData } from '@/interfaces/DailyData';
import moment from 'moment';
import { postDiary } from '@/api/diary';
import { useRouter } from 'next/navigation';
import { roundDisplay } from '@/components/MainDisplay/MainDisplay';
import { NullableNumber } from '@/interfaces/ItemModes';

export interface RecipeIngredient {
  rid: string;
  fid?: string;
  name: string;
  amount?: number;
  calories?: number;
  protein?: number;
  fibre?: number;
}

enum IngredientProperty {
  AMT = 'amount',
  CAL = 'calories',
  PRO = 'protein',
  FIB = 'fibre',
}

export default function Home() {
  const uid = useContext(UserContext);
  const { rounding } = useContext(SettingsContext);
  const router = useRouter();

  const [displayDate, setDisplayDate] = useState(moment());
  const [recipeName, setRecipeName] = useState<string>();
  const [selectedFood, setSelectedFood] = useState<DefinedFoodObject>();
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [servingDivisor, setServingDivisor] = useState<1 | 100>(1);
  const [servingAmount, setServingAmount] = useState<string>('1');
  const [calculatedRecipe, setCalculatedRecipe] = useState<DefinedFoodObject & { mode: 1 | 100 }>();

  useEffect(() => {
    if (selectedFood) {
      const { fid, name, calories, protein, fibre } = selectedFood;
      addIngredient({
        rid: uuidv4(),
        fid,
        name,
        calories: calories || 0,
        protein: protein || 0,
        fibre: fibre || 0,
      });
    }
  }, [selectedFood]);

  const addIngredient = (ingredient?: RecipeIngredient) => {
    console.log({ ingredient });
    setIngredients([...ingredients, ingredient || ({} as RecipeIngredient)]);
  };

  const modifyIngredient = (value: IngredientProperty, rid: string, amount: string) => {
    const mod = ingredients.findIndex((ingredient) => ingredient.rid == rid);
    console.log({ rid, amount, mod, ingredients });

    const newIngredients = [...ingredients];
    newIngredients[mod][value] = parseFloat(amount) || 0;
    setIngredients(newIngredients);
  };

  const calculateRecipe = () => {
    const { cal, pro, fib } = ingredients.reduce(
      ({ cal, pro, fib }, { calories, protein, fibre, amount }) => {
        const isCompleteEntry =
          typeof calories == 'number' &&
          typeof protein == 'number' &&
          typeof fibre == 'number' &&
          typeof amount == 'number';

        if (isCompleteEntry) {
          return {
            cal: cal + calories * (amount / 100),
            pro: pro + protein * (amount / 100),
            fib: fib + fibre * (amount / 100),
          };
        }
        return { cal, pro, fib };
      },
      { cal: 0, pro: 0, fib: 0 },
    );
    const servings = parseFloat(servingAmount) / servingDivisor;
    setCalculatedRecipe({
      fid: '',
      name: recipeName || 'Custom Recipe',
      calories: Math.round(cal / servings),
      protein: pro / servings,
      fibre: fib / servings,
      mode: servingDivisor,
    });
  };

  const saveRecipe = async () => {
    // Go through ingredients, save to DB any without a FID
    ingredients.forEach(async (ingredient) => {
      if (!ingredient.fid) {
        console.log('save to db', { ingredient });
        const { name, calories, protein, fibre, rid } = ingredient;
        const newFood = JSON.parse(
          await postFood({
            uid,
            name,
            calories,
            protein,
            fibre,
            plantPoints: 0,
          }),
        );

        // Update ingredients arary
        const mod = ingredients.findIndex((ingredient) => ingredient.rid == rid);
        const newIngredients = [...ingredients];
        newIngredients[mod].fid = newFood;
        setIngredients(newIngredients);
      }
      console.log({ ingredients });
    });
    // Send completedRecipe to diary DB
    const diaryEntry: Omit<DiaryData, 'did'> = {
      uid,
      date: moment(displayDate).format('YYYY-MM-DD'),
      serving: servingDivisor == 1 ? 1 : 0,
      isDirectEntry: true,
      isRecipe: servingDivisor == 1,
      foodEntry: {
        fid: uuidv4(),
        name: recipeName || 'Custom Recipe',
        calories: calculatedRecipe?.calories as number,
        protein: calculatedRecipe?.protein as number,
        fibre: calculatedRecipe?.fibre as number,
        plantPoints: calculatedRecipe?.plantPoints as number,
      },
      ingredients,
    };
    await postDiary(diaryEntry);

    // Return to diary page
    router.push('/tracker/');
  };

  const calculateDisplay = (metric: NullableNumber): string => {
    if (metric === null || metric === undefined) {
      return '---';
    }
    if (rounding) {
      return Math.round(metric).toString();
    } else {
      return roundDisplay(metric).toString();
    }
  };

  return (
    <>
      <DatePicker date={displayDate} setDisplayDate={setDisplayDate} compact={true} />
      <Section>
        Recipe:{' '}
        <InputField
          style={{ textAlign: 'left' }}
          value={recipeName}
          placeholder="Name of recipe"
          onChange={(e) => setRecipeName(e.target.value)}
        />
      </Section>
      <Table>
        <thead>
          <tr>
            <th colSpan={2}></th>
            <th colSpan={3}>--- per 100g ----</th>
          </tr>
          <tr>
            <th>Ingredient</th>
            <th>Portion</th>
            <th>Calorie</th>
            <th>Protein</th>
            <th>Fibre</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length > 0 &&
            ingredients.map((ingredient) => {
              return (
                <InputRow>
                  <InputCell>{ingredient.name}</InputCell>
                  <InputCell>
                    <InputField
                      id="ingredient amount"
                      value={ingredient.amount}
                      inputMode="decimal"
                      onChange={(e) =>
                        modifyIngredient(IngredientProperty.AMT, ingredient.rid, e.target.value)
                      }
                    />
                  </InputCell>
                  <InputCell>
                    <InputField
                      id="ingredient calories"
                      value={ingredient.calories}
                      inputMode="decimal"
                      onChange={(e) =>
                        modifyIngredient(IngredientProperty.CAL, ingredient.rid, e.target.value)
                      }
                    />
                  </InputCell>
                  <InputCell>
                    <InputField
                      id="ingredient protein"
                      value={ingredient.protein}
                      inputMode="decimal"
                      onChange={(e) =>
                        modifyIngredient(IngredientProperty.PRO, ingredient.rid, e.target.value)
                      }
                    />
                  </InputCell>
                  <InputCell>
                    <InputField
                      id="ingredient fibre"
                      value={ingredient.fibre}
                      inputMode="decimal"
                      onChange={(e) =>
                        modifyIngredient(IngredientProperty.FIB, ingredient.rid, e.target.value)
                      }
                    />
                  </InputCell>
                </InputRow>
              );
            })}

          <InputRow>
            <InputCell colSpan={5}>
              <SearchBar searchDbOnly={true} setSelectedFood={setSelectedFood} />
            </InputCell>
          </InputRow>
        </tbody>
      </Table>

      <FlexSection>
        <ServingToggle
          role="button"
          onClick={() => setServingDivisor(1)}
          $active={servingDivisor == 1}
        >
          Per Serving
        </ServingToggle>
        <ServingToggle
          role="button"
          $active={servingDivisor == 100}
          onClick={() => setServingDivisor(100)}
        >
          Per 100g
        </ServingToggle>
      </FlexSection>
      <Section>
        {servingDivisor == 1 ? 'Servings: ' : 'Total Cooked Weight: '}
        <InputField
          style={{ textAlign: 'left', width: '25%' }}
          type="text"
          name="serving"
          value={servingAmount}
          onChange={(e) => setServingAmount(e.target.value)}
        />
      </Section>
      <Section>
        <Calculate role="button" onClick={() => calculateRecipe()}>
          {calculatedRecipe ? 'Recalculate' : 'Calculate'} Recipe
        </Calculate>
      </Section>
      {calculatedRecipe && (
        <>
          <Table>
            <thead>
              <tr>
                <th>{calculatedRecipe.mode == 1 ? 'Per serving' : 'Per 100g'}</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Fibre</th>
              </tr>
            </thead>
            <tbody>
              <InputRow>
                <InputCell>{calculatedRecipe.name}</InputCell>
                <InputCell>{calculateDisplay(calculatedRecipe.calories)}</InputCell>
                <InputCell>{calculateDisplay(calculatedRecipe.protein)}</InputCell>
                <InputCell>{calculateDisplay(calculatedRecipe.fibre)}</InputCell>
              </InputRow>
            </tbody>
          </Table>
          <Save onClick={() => saveRecipe()}>Save Recipe to Diary</Save>
        </>
      )}
    </>
  );
}
