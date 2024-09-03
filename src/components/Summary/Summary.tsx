import { DiaryData } from '@/interfaces/DailyData';
import { roundDisplay } from '../MainDisplay/MainDisplay';
import { SkipWarning, SummaryTable } from './Summary.style';
import { useEffect } from 'react';

const fibreGoal = 30;
const proteinGoal = 45;

const Summary = ({ data }: { data: DiaryData[] }) => {
  let skippedEntry = false;

  const sum = (toSum: 'calories' | 'protein' | 'fibre') => {
    return data.reduce(
      (runningTotal, { serving, isDirectEntry, foodEntry: { [toSum]: metric } }) => {
        if (metric) {
          const denominator = isDirectEntry ? 1 : 100;
          const calculatedCalories = (serving * metric) / denominator;
          return runningTotal + calculatedCalories;
        }
        if (metric == null) {
          // Want to alert the user if there is a partial entry,
          // but not if the entry is just 0
          skippedEntry = true;
        }
        return runningTotal + 0;
      },
      0,
    );
  };

  const calorieTotal = sum('calories');
  const proteinTotal = sum('protein');
  const fibreTotal = sum('fibre');

  const drawRing = () => {
    const canvas = document.getElementById('myRing') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;

    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();
  };
  useEffect(() => {
    drawRing();
  }, []);
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
        {skippedEntry && (
          <tr>
            <SkipWarning colSpan={6}>
              Note: At least one partially completed item above is excluded from these totals.
            </SkipWarning>
          </tr>
        )}
      </tbody>
      <div id="myRing"></div>
    </SummaryTable>
  );
};

export default Summary;
