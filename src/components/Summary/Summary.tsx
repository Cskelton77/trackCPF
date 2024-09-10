import { DiaryData } from '@/interfaces/DailyData';
import { roundDisplay } from '../MainDisplay/MainDisplay';
import { ChartBinder, Ring, RingsWrapper, SkipWarning, SummaryTable } from './Summary.style';
import 'chart.js/auto';
import * as chart from 'react-chartjs-2';
import { theme } from '@/theme';
import { useContext } from 'react';
import { PROTEIN_CALCULATION, SettingsContext } from '@/context';

const NHS_DAILY_FIBRE = 30;
const NHS_DAILY_PROTEIN = 50;

const Summary = ({ data }: { data: DiaryData[] }) => {
  const context = useContext(SettingsContext);
  const { rounding, weight, protein } = context;

  const proteinMultiplier = protein == PROTEIN_CALCULATION.AGGRESSIVE ? 1.0 : 0.75;
  const dailyProteinGoal = weight > 1 ? proteinMultiplier * (weight / 2.205) : NHS_DAILY_PROTEIN;

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

  const currentCalorieTotal = sum('calories');
  const currentProteinTotal = sum('protein');
  const currentFibreTotal = sum('fibre');

  const fibrePercentage = (currentFibreTotal * 100) / NHS_DAILY_FIBRE;
  const fibreRemaining = Math.max(0, NHS_DAILY_FIBRE - currentFibreTotal);

  const proteinPercentage = (currentProteinTotal * 100) / dailyProteinGoal;
  const proteinRemaining = Math.max(0, dailyProteinGoal - currentProteinTotal);

  const generateChartData = (type: 'protein' | 'fibre') => {
    const isFibre = type === 'fibre';
    return {
      labels: [],
      datasets: [
        {
          label: '',
          data: isFibre ? [fibrePercentage, fibreRemaining] : [proteinPercentage, proteinRemaining],
          backgroundColor: [
            isFibre ? theme.colours.fibreRing : theme.colours.proteinRing,
            theme.colours.white,
          ],
          cutout: '65%',
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        },
      ],
    };
  };
  const fibreData = generateChartData('fibre');
  const proteinData = generateChartData('protein');

  const calorieDisplay = rounding
    ? Math.round(currentCalorieTotal)
    : roundDisplay(currentCalorieTotal);
  const proteinDisplay = rounding
    ? Math.round(currentProteinTotal)
    : roundDisplay(currentProteinTotal);
  const fibreDisplay = rounding ? Math.round(currentFibreTotal) : roundDisplay(currentFibreTotal);
  return (
    <SummaryTable>
      <span>Total: {calorieDisplay} calories</span>

      <RingsWrapper>
        <Ring>
          <ChartBinder>
            <chart.Doughnut data={proteinData} style={{ flex: 1 }} />
          </ChartBinder>
          <span>{proteinDisplay}g Protein</span>
          <span>/{Math.round(dailyProteinGoal)}g</span>
        </Ring>
        <Ring>
          <ChartBinder>
            <chart.Doughnut data={fibreData} style={{ flex: 1 }} />
          </ChartBinder>
          <span>{fibreDisplay}g Fibre</span>
          <span>/30g</span>
        </Ring>
      </RingsWrapper>

      {skippedEntry && (
        <span>
          <SkipWarning>
            Note: At least one partially completed item above is excluded from these totals.
          </SkipWarning>
        </span>
      )}
    </SummaryTable>
  );
};

export default Summary;
