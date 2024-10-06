import { DiaryData } from '@/interfaces/DailyData';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { MainDisplayTable, NumberCell, NumberHeader, TableCell } from './MainDisplay.style';
import { useContext } from 'react';
import { SettingsContext } from '@/context';
import { PlantPoint } from '@/Icons';
import { theme } from '@/theme';
import { NullableNumber } from '@/interfaces/ItemModes';

export const roundDisplay = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const MainDisplay = ({
  data,
  deleteEntry,
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
        {data.map(({ did, serving, isDirectEntry, foodEntry }) => {
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

          const { fid, name, calories, protein, fibre } = foodEntry;
          const unit = isDirectEntry ? ' serv' : 'g';

          return (
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
              </TableCell>
              <NumberCell>
                {serving}
                {unit}
              </NumberCell>
              <NumberCell>{calculateDisplay(calories)}</NumberCell>
              <NumberCell>{calculateDisplay(protein)}g</NumberCell>
              <NumberCell>{calculateDisplay(fibre)}g</NumberCell>
              {/* <TableCell
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEntry(did);
                }}
              >
                <Delete size={24} label={`Delete ${name}`} />
              </TableCell> */}
            </tr>
          );
        })}
      </tbody>
    </MainDisplayTable>
  );
};

export default MainDisplay;
