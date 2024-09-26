import { theme } from '@/theme';

export const generateChartData = (type: 'protein' | 'fibre', amount: number, limit: number) => {
  const isFibre = type === 'fibre';

  const percentage = (amount * 100) / limit;
  const remaining = Math.max(0, limit - amount);

  const proteinColour =
    amount >= limit ? theme.colours.proteinRingWarning : theme.colours.proteinRing;

  return {
    labels: [],
    datasets: [
      {
        label: '',
        data: [percentage, remaining],
        backgroundColor: [isFibre ? theme.colours.fibreRing : proteinColour, theme.colours.white],
        cutout: '65%',
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      },
    ],
  };
};
