import { DiaryData } from '@/interfaces/DailyData';
import { roundDisplay } from '../MainDisplay/MainDisplay';
import {
  ChartBinder,
  FlatStats,
  Ring,
  RingsWrapper,
  SkipWarning,
  SummaryTable,
} from './Summary.style';
import 'chart.js/auto';
import * as chart from 'react-chartjs-2';
import { theme } from '@/theme';
import { useContext } from 'react';
import { PROTEIN_CALCULATION, SettingsContext } from '@/context';
import { Moment } from 'moment';
import { PlantPoint } from '@/icons';
import { generateChartData } from './Summary.utils';

const NHS_DAILY_FIBRE = 30;
const NHS_DAILY_PROTEIN = 50;

const Summary = ({
  data,
  plantPoints,
}: {
  date: Moment;
  data: DiaryData[];
  plantPoints: number;
}) => {
  const context = useContext(SettingsContext);
  const { rounding, personaliseFibre, weight, protein, usePlantPoints } = context;

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

  const dailyFibreGoal = personaliseFibre ? (currentCalorieTotal * 14) / 1000 : NHS_DAILY_FIBRE;

  const proteinMultiplier = protein == PROTEIN_CALCULATION.AGGRESSIVE ? 1.0 : 0.75;
  const dailyProteinGoal = weight > 1 ? proteinMultiplier * (weight / 2.205) : NHS_DAILY_PROTEIN;
  const proteinLimit = weight > 1 ? 2 * (weight / 2.205) : 2 * NHS_DAILY_PROTEIN;

  const fibreData = generateChartData('fibre', currentFibreTotal, dailyFibreGoal, 70);
  const proteinData = generateChartData(
    'protein',
    currentProteinTotal,
    dailyProteinGoal,
    proteinLimit,
  );

  const calorieDisplay = rounding
    ? Math.round(currentCalorieTotal)
    : roundDisplay(currentCalorieTotal);
  const proteinDisplay = rounding
    ? Math.round(currentProteinTotal)
    : roundDisplay(currentProteinTotal);
  const fibreDisplay = rounding ? Math.round(currentFibreTotal) : roundDisplay(currentFibreTotal);

  // Turning off week display for now, clutter on the screen.
  //   const weekStart = moment(date).startOf('isoWeek').format('ddd, MMM Do').toString();
  //   const weekEnd = moment(date).endOf('isoWeek').format('ddd, MMM Do').toString();

  return (
    <SummaryTable>
      <FlatStats>Daily Total: {calorieDisplay} calories</FlatStats>
      {usePlantPoints && (
        <FlatStats>
          <PlantPoint style={{ fill: theme.colours.plantPoint }} /> Weekly Plant Points:{' '}
          {plantPoints}
        </FlatStats>
      )}
      <RingsWrapper>
        <Ring>
          <ChartBinder>
            <chart.Doughnut data={proteinData} style={{ flex: 1 }} />
          </ChartBinder>
          <span>{proteinDisplay}g Protein</span>
          <span aria-label="Daily Protein Goal">/{Math.round(dailyProteinGoal)}g</span>
        </Ring>
        <Ring>
          <ChartBinder>
            <chart.Doughnut data={fibreData} style={{ flex: 1 }} />
          </ChartBinder>
          <span>{fibreDisplay}g Fibre</span>
          <span aria-label="Daily Fibre Goal">/{Math.round(dailyFibreGoal)}g</span>
        </Ring>
      </RingsWrapper>
      {currentProteinTotal >= proteinLimit && (
        <span>
          <SkipWarning>Note: You have exceeded the max protein of 2g/KM.</SkipWarning>
        </span>
      )}

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
