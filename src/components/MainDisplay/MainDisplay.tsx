import { DiaryData } from '@/interfaces/DailyData';
import Delete from '../Icons/Delete';
import { DefinedFoodObject } from '@/interfaces/FoodObject';
import { MainDisplayTable, TableCell } from './MainDisplay.style';
import { useContext } from 'react';
import { SettingsContext } from '@/context';

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
  const context = useContext(SettingsContext);
  const { rounding } = context;

  return (
    <MainDisplayTable>
      <thead>
        <tr>
          <th>Item</th>
          <th>Serving</th>
          <th>Cal</th>
          <th>Protein</th>
          <th>Fibre</th>
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
          const calculateDisplay = (metric: number | undefined): string => {
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
          const unit = isDirectEntry ? (serving > 1 ? 'servings' : 'serving') : 'g';

          return (
            <tr
              key={`${fid}+${serving}`}
              onClick={isDirectEntry ? undefined : () => modifyEntry(did, serving, foodEntry)}
            >
              <TableCell>{name}</TableCell>
              <TableCell>
                {serving} {unit}
              </TableCell>
              <TableCell>{calculateDisplay(calories)}</TableCell>
              <TableCell>{calculateDisplay(protein)}g</TableCell>
              <TableCell>{calculateDisplay(fibre)}g</TableCell>
              <TableCell
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEntry(did);
                }}
              >
                <Delete size={24} />
              </TableCell>
            </tr>
          );
        })}
      </tbody>
    </MainDisplayTable>
  );
};

export default MainDisplay;
