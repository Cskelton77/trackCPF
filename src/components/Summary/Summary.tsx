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
import moment, { Moment } from 'moment';
import PlantPoint from '../Icons/PlantPoint';
import { generateChartData } from './Summary.utils';

const NHS_DAILY_FIBRE = 30;
const NHS_DAILY_PROTEIN = 50;

const Summary = ({
  date,
  data,
  plantPoints,
}: {
  date: Moment;
  data: DiaryData[];
  plantPoints: number;
}) => {
  const context = useContext(SettingsContext);
  const { rounding, weight, protein, usePlantPoints } = context;

  const proteinMultiplier = protein == PROTEIN_CALCULATION.AGGRESSIVE ? 1.0 : 0.75;
  const dailyProteinGoal = weight > 1 ? proteinMultiplier * (weight / 2.205) : NHS_DAILY_PROTEIN;
  const proteinLimit = weight > 1 ? 2 * (weight / 2.205) : 2 * NHS_DAILY_PROTEIN;
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

  //   let servingFlag = false;

  //   const totalCaloriesOfProtein = data.reduce(
  //     (count, { serving, isDirectEntry, foodEntry: { calories, protein } }) => {
  //       if (isDirectEntry) {
  //         servingFlag = true;
  //         return count + 0;
  //       } else {
  //         const percentageOfServing = (protein || 0 / serving) * (calories || 1);
  //         return count + percentageOfServing;
  //       }
  //     },
  //     0,
  //   );

  const currentCalorieTotal = sum('calories');
  const currentProteinTotal = sum('protein');
  const currentFibreTotal = sum('fibre');

  const fibreData = generateChartData('fibre', currentFibreTotal, NHS_DAILY_FIBRE);
  const proteinData = generateChartData('protein', currentProteinTotal, dailyProteinGoal);

  const calorieDisplay = rounding
    ? Math.round(currentCalorieTotal)
    : roundDisplay(currentCalorieTotal);
  const proteinDisplay = rounding
    ? Math.round(currentProteinTotal)
    : roundDisplay(currentProteinTotal);
  const fibreDisplay = rounding ? Math.round(currentFibreTotal) : roundDisplay(currentFibreTotal);

  //   const caloriesFromProteinDisplay = rounding
  //     ? Math.round(totalCaloriesOfProtein / currentCalorieTotal)
  //     : roundDisplay(totalCaloriesOfProtein / currentCalorieTotal);

  const weekStart = moment(date).startOf('isoWeek').format('ddd, MMM Do').toString();
  const weekEnd = moment(date).endOf('isoWeek').format('ddd, MMM Do').toString();

  return (
    <SummaryTable>
      <FlatStats>Daily Total: {calorieDisplay} calories</FlatStats>
      {/* <FlatStats>% calories from protein: {caloriesFromProteinDisplay}%</FlatStats> */}
      {/* {servingFlag && (
        <span>
          <SkipWarning>
            Note: This percentage excludes at least one item not entered by weight.
          </SkipWarning>
        </span>
      )} */}
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
      {usePlantPoints && (
        <>
          <FlatStats>
            {weekStart} - {weekEnd}
          </FlatStats>
          <FlatStats>
            <PlantPoint style={{ fill: theme.colours.plantPoint }} /> Plant Points: {plantPoints}
          </FlatStats>
        </>
      )}
    </SummaryTable>
  );
};

export default Summary;
