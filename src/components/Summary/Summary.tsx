import { DiaryData } from '@/interfaces/DailyData';
import { roundDisplay } from '../MainDisplay/MainDisplay';
import { SummaryTable } from './Summary.style';

const fibreGoal = 30;
const proteinGoal = 45;

const Summary = ({ data }: { data: DiaryData[] }) => {
  const sum = (toSum: 'calories' | 'protein' | 'fibre') => {
    return data.reduce(
      (runningTotal, { serving, isDirectEntry, foodEntry: { [toSum]: metric } }) => {
        if (metric) {
          const denominator = isDirectEntry ? serving : 100;
          const calculatedCalories = (serving * metric) / denominator;
          return runningTotal + calculatedCalories;
        }
        return runningTotal + 0;
      },
      0,
    );
  };

  const calorieTotal = sum('calories');
  const proteinTotal = sum('protein');
  const fibreTotal = sum('fibre');

  return (
    <SummaryTable>
      <tbody>
        <tr>
          <td>Total:</td>
          <td></td>
          <td>{roundDisplay(calorieTotal)} calories</td>
          <td>{roundDisplay(proteinTotal)}g protein</td>
          <td>{roundDisplay(fibreTotal)}g fibre</td>
          <td></td>
        </tr>
      </tbody>
    </SummaryTable>
  );
};

export default Summary;
