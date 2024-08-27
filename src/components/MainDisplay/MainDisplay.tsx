import { DailyData } from '@/interfaces/DailyData';
import Delete from '../Icons/Delete';

export const roundDisplay = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

const MainDisplay = ({ data }: { data: DailyData[] }) => {
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
        {data.map(({ name, serving, calories, protein, fibre, isDirectEntry }) => {
          const servingDivider = (isDirectEntry ? 1 : serving)/100;

          return (
            <tr key={name}>
              <td>{name}</td>
              <td>{isDirectEntry? serving : (<input value={serving} />) }g</td>
              <td>{roundDisplay(calories * servingDivider)}</td>
              <td>{roundDisplay(protein * servingDivider)}g</td>
              <td>{roundDisplay(fibre * servingDivider)}g</td>
              <td> <Delete  size={24}/></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MainDisplay;
