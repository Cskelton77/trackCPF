import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import moment from 'moment';
import { Summary } from '@/components';
import { v4 as uuidv4 } from 'uuid';
import { SettingsContext, SettingsContextInterface, defaultSettings } from '@/context';
import { DiaryData } from '@/interfaces/DailyData';
import { generateChartData } from './Summary.utils';
import { theme } from '@/theme';

describe('Summary component', () => {
  const mockDate = moment('2024-09-21');
  const mockPlantPoints = 23;

  const defaultData: DiaryData[] = [
    {
      did: uuidv4(),
      uid: uuidv4(),
      date: '2024-09-23',
      serving: 100,
      isDirectEntry: false,
      foodEntry: {
        fid: uuidv4(),
        name: 'Item 1',
        calories: 150,
        protein: 10,
        fibre: 5,
        plantPoints: 1,
      },
    },
    {
      did: uuidv4(),
      uid: uuidv4(),
      date: '2024-09-23',
      serving: 100,
      isDirectEntry: false,
      foodEntry: {
        fid: uuidv4(),
        name: 'Item 2',
        calories: 75,
        protein: 5.5,
        fibre: 2.5,
        plantPoints: 1,
      },
    },
    {
      did: uuidv4(),
      uid: uuidv4(),
      date: '2024-09-23',
      serving: 2,
      isDirectEntry: true,
      foodEntry: {
        fid: uuidv4(),
        name: 'Item 3',
        calories: 12,
        protein: 1,
        fibre: 0,
        plantPoints: 0,
      },
    },
    {
      did: uuidv4(),
      uid: uuidv4(),
      date: '2024-09-23',
      serving: 10,
      isDirectEntry: false,
      foodEntry: {
        fid: uuidv4(),
        name: 'Item 4',
        calories: 600,
        protein: 10,
        fibre: 10,
        plantPoints: 1,
      },
    },
  ];

  const renderSummary = async ({
    additionalEntry,
    modifiedSettings,
  }: {
    additionalEntry?: DiaryData;
    modifiedSettings?: Partial<SettingsContextInterface>;
  }) => {
    const mockSettings = { ...defaultSettings, ...modifiedSettings };
    const mockData = [...defaultData];
    additionalEntry && mockData.push(additionalEntry);

    render(
      <SettingsContext.Provider value={{ ...mockSettings }}>
        <Summary date={mockDate} data={mockData} plantPoints={mockPlantPoints} />
      </SettingsContext.Provider>,
    );
  };

  it('should correctly sum calories', () => {
    renderSummary({});
    const calorieCount = screen.getByText('Daily Total: 309 calories');
    expect(calorieCount).toBeInTheDocument();
  });

  it('should correctly sum protein', () => {
    renderSummary({});
    const proteinCount = screen.getByText('18.5g Protein');
    expect(proteinCount).toBeInTheDocument();
  });

  it('should correctly sum fibre', () => {
    renderSummary({});
    const fibreCount = screen.getByText('8.5g Fibre');
    expect(fibreCount).toBeInTheDocument();
  });

  it('should respect rounding settings', () => {
    renderSummary({ modifiedSettings: { rounding: true } });
    const proteinCount = screen.getByText('19g Protein');
    const fibreCount = screen.getByText('9g Fibre');
    expect(proteinCount).toBeInTheDocument();
    expect(fibreCount).toBeInTheDocument();
  });

  it('should display a correct ring calculation', () => {
    const response = generateChartData('protein', 25, 50);
    expect(response).toBe({
      labels: [],
      datasets: [
        {
          label: '',
          data: [50, 50],
          backgroundColor: [theme.colours.proteinRing, theme.colours.white],
          cutout: '65%',
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        },
      ],
    });
  });

  it('should warn the user if protein is too high', () => {
    const tooMuchProtein = {
      did: uuidv4(),
      uid: uuidv4(),
      date: '2024-09-23',
      serving: 100,
      isDirectEntry: false,
      foodEntry: {
        fid: uuidv4(),
        name: 'Item 5',
        calories: 150,
        protein: 150,
        fibre: 5,
        plantPoints: 1,
      },
    };
    renderSummary({ additionalEntry: tooMuchProtein });
    const proteinCount = screen.getByText('168.5g Protein');
    expect(proteinCount).toBeInTheDocument();
    const warning = screen.getByText('Note: You have exceeded the max protein of 2g/KM.');
    expect(warning).toBeInTheDocument();
  });

  it('should warn the user if an item is excluded from count', () => {
    const incompleteEntry = {
      did: uuidv4(),
      uid: uuidv4(),
      date: '2024-09-23',
      serving: 100,
      isDirectEntry: false,
      foodEntry: {
        fid: uuidv4(),
        name: 'Item 5',
        calories: null,
        protein: 12,
        fibre: 5,
        plantPoints: 1,
      },
    };
    renderSummary({ additionalEntry: incompleteEntry });
    const calorieCount = screen.getByText('Daily Total: 309 calories');
    expect(calorieCount).toBeInTheDocument();

    const warning = screen.getByText(
      'Note: At least one partially completed item above is excluded from these totals.',
    );
    expect(warning).toBeInTheDocument();
  });
});
