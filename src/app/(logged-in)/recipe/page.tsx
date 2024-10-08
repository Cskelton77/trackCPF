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
  ServingLabel,
  FlexInputField,
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
import { PlantPoint } from '@/Icons';
import { theme } from '@/theme';

export interface RecipeIngredient {
  rid: string;
  fid?: string;
  name: string;
  amount?: string;
  calories?: string;
  protein?: string;
  fibre?: string;
  plantPoints?: string;
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
  const [servingAmount, setServingAmount] = useState<string>();
  const [calculatedRecipe, setCalculatedRecipe] = useState<DefinedFoodObject & { mode: 1 | 100 }>();

  const readyToCalculate = !!servingAmount && ingredients.length > 0;
  useEffect(() => {
    if (selectedFood) {
      const { fid, name, calories, protein, fibre, plantPoints } = selectedFood;
      const newIngredient = {
        rid: uuidv4(),
        fid,
        name,
        calories: calories?.toString() || undefined,
        protein: protein?.toString() || undefined,
        fibre: fibre?.toString() || undefined,
        plantPoints: plantPoints?.toString() || '0',
      };
      setIngredients([...ingredients, newIngredient]);
    }
  }, [selectedFood]);

  const modifyIngredient = (value: IngredientProperty, rid: string, amount: string) => {
    const mod = ingredients.findIndex((ingredient) => ingredient.rid == rid);
    const newIngredients = [...ingredients];
    newIngredients[mod][value] = amount;
    setIngredients(newIngredients);
  };

  const calculateRecipe = () => {
    if (readyToCalculate) {
      const { cal, pro, fib, pp } = ingredients.reduce(
        ({ cal, pro, fib, pp }, { calories, protein, fibre, plantPoints, amount }) => {
          const nCalories = parseFloat(calories || '0');
          const nProtein = parseFloat(protein || '0');
          const nFibre = parseFloat(fibre || '0');
          const nAmount = parseFloat(amount || '0');

          const isCompleteEntry = calories && protein && fibre && amount;
          if (isCompleteEntry) {
            return {
              cal: cal + nCalories * (nAmount / 100),
              pro: pro + nProtein * (nAmount / 100),
              fib: fib + nFibre * (nAmount / 100),
              pp: pp + parseFloat(plantPoints || '0'),
            };
          }
          return { cal, pro, fib, pp };
        },
        { cal: 0, pro: 0, fib: 0, pp: 0 },
      );
      const servings = parseFloat(servingAmount || '0') / servingDivisor;
      setCalculatedRecipe({
        fid: '',
        name: recipeName || 'Custom Recipe',
        calories: cal / servings,
        protein: pro / servings,
        fibre: fib / servings,
        mode: servingDivisor,
        plantPoints: pp,
      });
    }
  };

  const saveRecipe = async () => {
    // Go through ingredients, save to DB any without a FID
    ingredients.forEach(async (ingredient) => {
      if (!ingredient.fid) {
        const { name, calories, protein, fibre, rid, plantPoints } = ingredient;
        const newFood = JSON.parse(
          await postFood({
            uid,
            name,
            calories: parseFloat(calories || '0'),
            protein: parseFloat(protein || '0'),
            fibre: parseFloat(fibre || '0'),
            plantPoints: parseInt(plantPoints || ''),
          }),
        );

        // Update ingredients arary
        const mod = ingredients.findIndex((ingredient) => ingredient.rid == rid);
        const newIngredients = [...ingredients];
        newIngredients[mod].fid = newFood;
        setIngredients(newIngredients);
      }
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
        plantPoints: calculatedRecipe?.plantPoints || 0,
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
        {ingredients.length > 0 && (
          <thead>
            <tr>
              <th colSpan={2}></th>
              <th colSpan={3}>----- per 100g ------</th>
            </tr>
            <tr>
              <th></th>
              <th>Grams</th>
              <th>Calorie</th>
              <th>Protein</th>
              <th>Fibre</th>
            </tr>
          </thead>
        )}
        <tbody>
          {ingredients.length > 0 &&
            ingredients.map((ingredient) => {
              return (
                <InputRow key={ingredient.rid}>
                  <InputCell>
                    <div>
                      {ingredient.name}{' '}
                      {ingredient.plantPoints ? (
                        <PlantPoint style={{ fill: theme.colours.plantPoint }} />
                      ) : (
                        ''
                      )}
                    </div>
                  </InputCell>
                  <InputCell>
                    <InputField
                      id="ingredient amount"
                      aria-label={`${ingredient.name} Amount`}
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
                      aria-label={`${ingredient.name} Calories`}
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
                      aria-label={`${ingredient.name} Protein`}
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
                      aria-label={`${ingredient.name} Fibre`}
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
              <SearchBar
                searchDbOnly={true}
                setSelectedFood={setSelectedFood}
                placeholder={'Add an ingredient'}
              />
            </InputCell>
          </InputRow>
        </tbody>
      </Table>

      <FlexSection>
        <ServingLabel>Calculation Mode:</ServingLabel>
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
      <FlexSection>
        <ServingLabel>
          {servingDivisor == 1 ? 'Servings: ' : 'Total Cooked Weight (g): '}
        </ServingLabel>
        <FlexInputField
          style={{ textAlign: 'left', width: '25%' }}
          type="text"
          inputMode="decimal"
          aria-label={`Recipe ${servingDivisor == 1 ? 'Servings' : 'Total Cooked Weight'}`}
          name="serving"
          value={servingAmount}
          onChange={(e) => setServingAmount(e.target.value)}
        />
      </FlexSection>
      {readyToCalculate && (
        <Section>
          <Calculate role="button" onClick={() => calculateRecipe()} $disabled={!readyToCalculate}>
            {calculatedRecipe ? 'Recalculate' : 'Calculate'} Recipe
          </Calculate>
        </Section>
      )}

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
          <Save role="button" onClick={() => saveRecipe()}>
            Save Recipe to Diary
          </Save>
        </>
      )}
    </>
  );
}
