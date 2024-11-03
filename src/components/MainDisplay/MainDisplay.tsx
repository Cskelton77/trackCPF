import { DiaryData } from '@/interfaces/DailyData';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import {
  IndentedTableCell,
  IngredientRow,
  MainDisplayTable,
  NumberCell,
  NumberHeader,
  TableCell,
} from './MainDisplay.style';
import { useContext } from 'react';
import { SettingsContext } from '@/context';
import { PlantPoint, Recipe } from '@/icons';
import { theme } from '@/theme';
import { NullableNumber } from '@/interfaces/ItemModes';

export const roundDisplay = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const MainDisplay = ({
  data,
  modifyEntry,
  deleteEntry,
}: {
  data: DiaryData[];
  deleteEntry: (diaryId: string, item: DefinedFoodObject) => void;
  modifyEntry: (
    diaryId: string,
    currentServing: number,
    update: DefinedFoodObject,
  ) => Promise<void>;
}) => {
  const { rounding } = useContext(SettingsContext);
  return (
    <MainDisplayTable>
      <thead>
        <tr>
          <th>Item</th>
          <NumberHeader>Serving</NumberHeader>
          <NumberHeader>Cal</NumberHeader>
          <NumberHeader>Protein</NumberHeader>
          <NumberHeader>Fibre</NumberHeader>
        </tr>
      </thead>
      <tbody>
        {data.length == 0 && (
          <tr>
            <TableCell colSpan={5} style={{ textAlign: 'center' }}>
              No Data for Today Yet
            </TableCell>
          </tr>
        )}
        {data.map(({ did, serving, isDirectEntry, foodEntry, isRecipe, ingredients }) => {
          const denominator = isDirectEntry ? 1 : 100;
          const calculateDisplay = (metric: NullableNumber): string => {
            if (metric === null || metric === undefined) {
              return '---';
            }
            const calculation = (serving * metric) / denominator;
            if (rounding) {
              return Math.round(calculation).toString();
            } else {
              return roundDisplay(calculation).toString();
            }
          };

          const { fid, name, calories, protein, fibre, recipeWeight } = foodEntry;
          const unit = isDirectEntry ? '' : 'g';
          return (
            <>
              <tr
                key={`${fid}+${serving}`}
                onClick={
                  isDirectEntry
                    ? () => deleteEntry(did, foodEntry)
                    : () => modifyEntry(did, serving, foodEntry)
                }
              >
                <TableCell>
                  {name}{' '}
                  {foodEntry.plantPoints ? (
                    <PlantPoint style={{ fill: theme.colours.plantPoint }} />
                  ) : (
                    ''
                  )}
                  {isRecipe ? <Recipe /> : ''}
                </TableCell>
                <NumberCell>
                  {serving}
                  {unit}
                </NumberCell>
                <NumberCell>{calculateDisplay(calories)}</NumberCell>
                <NumberCell>{calculateDisplay(protein)}g</NumberCell>
                <NumberCell>{calculateDisplay(fibre)}g</NumberCell>
              </tr>
              {ingredients &&
                ingredients.map(
                  ({ rid, fid, name, amount, calories, protein, fibre, plantPoints }) => {
                    const parseDirect = (num: string | undefined) =>
                      calculateDisplay((parseFloat(num || '0') * parseFloat(amount || '0')) / 100);

                    const parseForRecipe = (num: string | undefined) => {
                      const calc =
                        parseInt(num || '100') * (parseInt(num || '100') / (recipeWeight || 100));
                      if (rounding) {
                        return Math.round(calc).toString();
                      } else {
                        return roundDisplay(calc).toString();
                      }
                    };

                    const displayCal = isDirectEntry
                      ? parseDirect(calories)
                      : parseForRecipe(calories);
                    const displayProtein = isDirectEntry
                      ? parseDirect(protein)
                      : parseForRecipe(protein);
                    const displayFibre = isDirectEntry ? parseDirect(fibre) : parseForRecipe(fibre);

                    const displayAmount = isDirectEntry
                      ? calculateDisplay(parseFloat(amount || '0'))
                      : parseInt(amount || '100') * (serving / (recipeWeight || 100));

                    return (
                      <IngredientRow key={`${fid}+${rid}+${amount}`}>
                        <IndentedTableCell>
                          {name}{' '}
                          {parseFloat(plantPoints || '0') > 0 ? (
                            <PlantPoint style={{ fill: theme.colours.plantPoint }} />
                          ) : (
                            ''
                          )}
                        </IndentedTableCell>
                        <NumberCell>{displayAmount}g</NumberCell>
                        <NumberCell>{displayCal}</NumberCell>
                        <NumberCell>{displayProtein}g</NumberCell>
                        <NumberCell>{displayFibre}g</NumberCell>
                      </IngredientRow>
                    );
                  },
                )}
            </>
          );
        })}
      </tbody>
    </MainDisplayTable>
  );
};

export default MainDisplay;
