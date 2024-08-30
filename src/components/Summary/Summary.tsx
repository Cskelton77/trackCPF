import { DiaryData } from '@/interfaces/DailyData';
import { roundDisplay } from '../MainDisplay/MainDisplay';


const fibreGoal = 30;
const proteinGoal = 45;

const Summary = ({ data }: { data: DiaryData[] }) => {

    const calorieTotal = data.reduce(
    (runningTotal, nextEntry) => runningTotal + (nextEntry.foodEntry.calories  || 0 * (nextEntry.isDirectEntry ? 1 : nextEntry.serving)/100),
    0,
  );
  const proteinTotal = data.reduce(
    (runningTotal, nextEntry) => runningTotal + (nextEntry.foodEntry.protein || 0 * (nextEntry.isDirectEntry ? 1 : nextEntry.serving)/100),
    0,
  );
  const fibreTotal = data.reduce((runningTotal, nextEntry) => runningTotal + (nextEntry.foodEntry.fibre || 0 * (nextEntry.isDirectEntry ? 1 : nextEntry.serving)/100), 0);

  return (
    <table>
      <tbody>
        <tr>
          <td>Daily Total:</td>
          <td>{roundDisplay(calorieTotal)}</td>
          <td>{roundDisplay(proteinTotal)}</td>
          <td>{roundDisplay(fibreTotal)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Summary