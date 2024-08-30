import { DiaryData } from '@/interfaces/DailyData';
import Delete from '../Icons/Delete';
import { FoodObject } from '@/interfaces/FoodObject';

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
    update: FoodObject,
  ) => Promise<void>;
}) => {

  return (
    <table>
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
                <td>No Data for Today Yet</td>
            </tr>
        )}
        {data.map(({ did, serving, isDirectEntry, foodEntry }) => {
          const servingDivider = (isDirectEntry ? 1 : serving/100);
          const calculateDisplay = (metric: number | undefined): string =>
            metric == null ? '--' : roundDisplay(metric * servingDivider).toString();

          const { name, calories, protein, fibre } = foodEntry;
          const unit = isDirectEntry ? (serving > 1 ? 'servings' : 'serving') : 'g';

          return (
            <tr key={name} onClick={isDirectEntry? undefined : () => modifyEntry(did, serving, foodEntry)}>
              <td>{name}</td>
              <td>
                {serving} {unit}
              </td>
              <td>{calculateDisplay(calories)}</td>
              <td>{calculateDisplay(protein)}</td>
              <td>{calculateDisplay(fibre)}</td>
              <td onClick={(e) => { e.stopPropagation(); deleteEntry(did);}}>
                <Delete size={24}  />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MainDisplay;
