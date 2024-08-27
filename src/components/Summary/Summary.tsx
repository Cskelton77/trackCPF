import { DailyData } from '@/interfaces/DailyData';
import { roundDisplay } from '../MainDisplay/MainDisplay';

const Summary = ({ data }: { data: DailyData[] }) => {

    const calorieTotal = data.reduce(
    (runningTotal, nextEntry) => runningTotal + (nextEntry.calories * (nextEntry.isDirectEntry ? 1 : nextEntry.serving)/100),
    0,
  );
  const proteinTotal = data.reduce(
    (runningTotal, nextEntry) => runningTotal + (nextEntry.protein * (nextEntry.isDirectEntry ? 1 : nextEntry.serving)/100),
    0,
  );
  const fibreTotal = data.reduce((runningTotal, nextEntry) => runningTotal + (nextEntry.fibre * (nextEntry.isDirectEntry ? 1 : nextEntry.serving)/100), 0);

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