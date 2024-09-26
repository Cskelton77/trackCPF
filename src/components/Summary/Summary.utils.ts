import { theme } from '@/theme';

export const generateChartData = (
  type: 'protein' | 'fibre',
  amount: number,
  goal: number,
  limit: number,
) => {
  const isFibre = type === 'fibre';

  const percentage = Math.min(100, (amount * 100) / goal);
  const remaining = (Math.max(0, goal - amount) / goal) * 100;

  const colour = isFibre ? theme.colours.fibreRing : theme.colours.proteinRing;

  let displayColour = '';
  switch (true) {
    case amount >= limit:
      displayColour = theme.colours.ringWarning;
      break;
    case amount >= limit * 0.75:
      displayColour = theme.colours.ringCaution;
      break;
    default:
      displayColour = colour;
  }

  return {
    labels: [],
    datasets: [
      {
        label: '',
        data: [percentage, remaining],
        backgroundColor: [displayColour, theme.colours.white],
        borderColor: theme.colours.lightGrey,
        borderWidth: 1,
        cutout: '65%',
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      },
    ],
  };
};
