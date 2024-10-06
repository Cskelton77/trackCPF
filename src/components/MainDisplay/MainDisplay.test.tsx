import { MainDisplay } from '@/components';
import { SettingsContext, defaultSettings } from '@/context';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: () => null,
    };
  },
}));

describe('Main Display Table', () => {
  const mockDeleteEntry = jest.fn();
  const mockModifyEntry = jest.fn();

  const mockDataDirectEntry = [
    {
      did: 'MOCK_DID',
      uid: 'MOCK_UID',
      date: '2024-09-22',
      serving: 100,
      isDirectEntry: false,
      foodEntry: {
        fid: 'MOCK_FID',
        name: 'Editable Food',
        calories: 100,
        protein: 0,
        fibre: null,
        plantPoints: 1,
      },
    },
  ];
  const mockDataNonDirect = [
    {
      did: 'MOCK_DID2',
      uid: 'MOCK_UID2',
      date: '2024-09-22',
      serving: 1,
      isDirectEntry: true,
      foodEntry: {
        fid: 'MOCK_FID2',
        name: 'Non-Editable Food',
        calories: 120,
        protein: 3,
        fibre: 1.6,
        plantPoints: 0,
      },
    },
  ];

  const mockSettings = defaultSettings;
  it('Should display No Data if empty', () => {
    render(<MainDisplay data={[]} deleteEntry={mockDeleteEntry} modifyEntry={mockModifyEntry} />);
    screen.getByText('No Data for Today Yet');
  });

  it('Should display data passed in', async () => {
    render(
      <MainDisplay
        data={mockDataDirectEntry}
        deleteEntry={mockDeleteEntry}
        modifyEntry={mockModifyEntry}
      />,
    );
    await screen.findByText('Editable Food');
  });

  it('Should display 0 for zero-values', () => {
    render(
      <MainDisplay
        data={mockDataDirectEntry}
        deleteEntry={mockDeleteEntry}
        modifyEntry={mockModifyEntry}
      />,
    );
    screen.getByText('0g');
  });

  it('Should display --- for skipped values', () => {
    render(
      <MainDisplay
        data={mockDataDirectEntry}
        deleteEntry={mockDeleteEntry}
        modifyEntry={mockModifyEntry}
      />,
    );
    screen.getByText('---g');
  });

  it('Should display a star for Plant Points', () => {
    render(
      <MainDisplay
        data={mockDataDirectEntry}
        deleteEntry={mockDeleteEntry}
        modifyEntry={mockModifyEntry}
      />,
    );
    screen.getByRole('img', { name: 'Plant Point' });
  });

  it('Should allow an editable row to be modified', async () => {
    render(
      <MainDisplay
        data={mockDataDirectEntry}
        deleteEntry={mockDeleteEntry}
        modifyEntry={mockModifyEntry}
      />,
    );
    const row = await screen.findByText('Editable Food');
    await userEvent.click(row);
    expect(mockModifyEntry).toHaveBeenCalled();
  });

  it('Should not allow a non-editable row to be modified', async () => {
    render(
      <MainDisplay
        data={mockDataNonDirect}
        deleteEntry={mockDeleteEntry}
        modifyEntry={mockModifyEntry}
      />,
    );
    const row = await screen.findByText('Non-Editable Food');
    await userEvent.click(row);
    expect(mockModifyEntry).not.toHaveBeenCalled();
  });

  it('Should respect rounding preference', async () => {
    render(
      <SettingsContext.Provider value={{ ...mockSettings, rounding: true }}>
        <MainDisplay
          data={mockDataNonDirect}
          deleteEntry={mockDeleteEntry}
          modifyEntry={mockModifyEntry}
        />
        ,
      </SettingsContext.Provider>,
    );
    await screen.findByText('2g');
  });

  it('Should respect non-rounding preference', async () => {
    render(
      <SettingsContext.Provider value={{ ...mockSettings, rounding: false }}>
        <MainDisplay
          data={mockDataNonDirect}
          deleteEntry={mockDeleteEntry}
          modifyEntry={mockModifyEntry}
        />
        ,
      </SettingsContext.Provider>,
    );
    await screen.findByText('1.6g');
  });
});
