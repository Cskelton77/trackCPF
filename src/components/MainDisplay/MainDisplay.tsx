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
import { PlantPoint, Recipe } from '@/Icons';
import { theme } from '@/theme';
import { NullableNumber } from '@/interfaces/ItemModes';

export const roundDisplay = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const MainDisplay = ({
  data,
  modifyEntry,
}: {
  data: DiaryData[];
  deleteEntry: (diaryId: string) => Promise<void>;
  modifyEntry: (
    diaryId: string,
    currentServing: number,
    update: DefinedFoodObject,
  ) => Promise<void>;
}) => {
  const { rounding } = useContext(SettingsContext);
  console.log({ data });
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
          const calculateDisplay = (metric: NullableNumber | string): string => {
            const adjustedMetric = typeof metric == 'string' ? parseFloat(metric || '0') : metric;

            if (adjustedMetric === null || adjustedMetric === undefined) {
              return '---';
            }
            const calculation = (serving * adjustedMetric) / denominator;
            if (rounding) {
              return Math.round(calculation).toString();
            } else {
              return roundDisplay(calculation).toString();
            }
          };

          const { fid, name, calories, protein, fibre } = foodEntry;
          const unit = isDirectEntry ? '' : 'g';

          return (
            <>
              <tr
                key={`${fid}+${serving}`}
                onClick={isDirectEntry ? undefined : () => modifyEntry(did, serving, foodEntry)}
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
              {isRecipe &&
                ingredients &&
                ingredients.map(({ rid, fid, name, amount, calories, protein, fibre }) => {
                  return (
                    <IngredientRow key={`${fid}+${rid}+${amount}`}>
                      <IndentedTableCell>
                        {name}{' '}
                        {foodEntry.plantPoints ? (
                          <PlantPoint style={{ fill: theme.colours.plantPoint }} />
                        ) : (
                          ''
                        )}
                      </IndentedTableCell>
                      <NumberCell>{amount}g</NumberCell>
                      <NumberCell>{calculateDisplay(calories)}</NumberCell>
                      <NumberCell>{calculateDisplay(protein)}g</NumberCell>
                      <NumberCell>{calculateDisplay(fibre)}g</NumberCell>
                    </IngredientRow>
                  );
                })}
            </>
          );
        })}
      </tbody>
    </MainDisplayTable>
  );
};

export default MainDisplay;
