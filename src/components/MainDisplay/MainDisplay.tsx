import { DiaryData } from '@/interfaces/DailyData';
import Delete from '../Icons/Delete';
import { FoodObject } from '@/interfaces/FoodObject';
import { MainDisplayTable, TableCell } from './MainDisplay.style';

export const roundDisplay = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const MainDisplay = ({
  data,
  deleteEntry,
  modifyEntry,
}: {
  data: DiaryData[];
  deleteEntry: (diaryId: string) => Promise<void>;
  modifyEntry: (diaryId: string, currentServing: number, update: FoodObject) => Promise<void>;
}) => {
  return (
    <MainDisplayTable>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Serving</th>
          <th>Calories</th>
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
          const servingDivider = isDirectEntry ? 1 : serving / 100;
          const calculateDisplay = (metric: number | undefined): string =>
            metric == null ? '--' : roundDisplay(metric * servingDivider).toString();

          const { name, calories, protein, fibre } = foodEntry;
          const unit = isDirectEntry ? (serving > 1 ? 'servings' : 'serving') : 'g';

          return (
            <tr
              key={name}
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
