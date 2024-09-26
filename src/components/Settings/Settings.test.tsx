import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Settings } from '@/components';
import { GENDER, PROTEIN_CALCULATION, SettingsContext, defaultSettings } from '@/context';
import { v4 as uuidv4 } from 'uuid';

import { saveSettings } from '../../api/users/settings/post';
jest.mock('../../api/users/settings/post', () => ({
  saveSettings: jest.fn(() => {}),
}));

describe('Settings Screen', () => {
  const uid = uuidv4();
  const mockClose = jest.fn();

  const renderSettings = async () => {
    const mockSettings = defaultSettings;
    render(
      <SettingsContext.Provider value={{ ...mockSettings }}>
        <Settings title="User Settings" isVisible={true} close={mockClose} uid={uid} />
      </SettingsContext.Provider>,
    );
  };

  it('should display saved settings when available', async () => {
    await renderSettings();
    const maleRadio = await screen.findByRole('radio', { name: 'Male' });
    const femaleRadio = await screen.findByRole('radio', { name: 'Female' });
    expect(maleRadio).toHaveProperty('checked', true);
    expect(femaleRadio).toHaveProperty('checked', false);

    const age = await screen.findByRole('textbox', { name: 'My age is:' });
    expect(age).toHaveDisplayValue('1');

    const feet = await screen.findByRole('textbox', { name: 'Height in feet' });
    expect(feet).toHaveDisplayValue('1');
    const inches = await screen.findByRole('textbox', { name: 'Height in inches' });
    expect(inches).toHaveDisplayValue('1');

    const weight = await screen.findByRole('textbox', { name: 'My weight is:' });
    expect(weight).toHaveDisplayValue('1');

    const proteinSetting = await screen.findByRole('radio', {
      name: 'conservative protein calculation',
    });
    expect(proteinSetting).toHaveProperty('checked', true);

    const roundingSetting = await screen.findByRole('radio', {
      name: 'display numbers to two decimals',
    });
    expect(roundingSetting).toHaveProperty('checked', true);

    const fibrePersonalisation = await screen.findByRole('radio', {
      name: 'Personalise Fibre Goal',
    });
    expect(fibrePersonalisation).toHaveProperty('checked', true);

    const plantPointsSetting = await screen.findByRole('radio', {
      name: 'Enable plant points feature',
    });
    expect(plantPointsSetting).toHaveProperty('checked', true);
  });

  it('should submit new settings when available', async () => {
    const newSettings = {
      gender: GENDER.FEMALE,
      age: 32,
      heightFeet: 5,
      heightInches: 2,
      weight: 148,
      protein: PROTEIN_CALCULATION.AGGRESSIVE,
      rounding: true,
      personaliseFibre: false,
      usePlantPoints: false,
    };
    await renderSettings();
    const femaleRadio = await screen.findByRole('radio', { name: 'Female' });
    await userEvent.click(femaleRadio);
    expect(femaleRadio).toHaveProperty('checked', true);

    const age = await screen.findByRole('textbox', { name: 'My age is:' });
    await userEvent.clear(age);
    await userEvent.type(age, '32');
    expect(age).toHaveDisplayValue('32');

    const feet = await screen.findByRole('textbox', { name: 'Height in feet' });
    await userEvent.clear(feet);
    await userEvent.type(feet, '5');
    expect(feet).toHaveDisplayValue('5');

    const inches = await screen.findByRole('textbox', { name: 'Height in inches' });
    await userEvent.clear(inches);
    await userEvent.type(inches, '2');
    expect(inches).toHaveDisplayValue('2');

    const weight = await screen.findByRole('textbox', { name: 'My weight is:' });
    await userEvent.clear(weight);
    await userEvent.type(weight, '148');
    expect(weight).toHaveDisplayValue('148');

    const proteinSetting = await screen.findByRole('radio', {
      name: 'aggressive protein calculation',
    });
    await userEvent.click(proteinSetting);
    expect(proteinSetting).toHaveProperty('checked', true);

    const roundingSetting = await screen.findByRole('radio', {
      name: 'round to whole numbers',
    });
    await userEvent.click(roundingSetting);
    expect(roundingSetting).toHaveProperty('checked', true);

    const plantPointsSetting = await screen.findByRole('radio', {
      name: 'Disable plant points feature',
    });
    await userEvent.click(plantPointsSetting);
    expect(plantPointsSetting).toHaveProperty('checked', true);

    const fibrePersonalisation = await screen.findByRole('radio', {
      name: 'Use NHS Recommended Fibre',
    });
    await userEvent.click(fibrePersonalisation);
    expect(fibrePersonalisation).toHaveProperty('checked', true);

    const saveButton = screen.getByRole('button', { name: 'save settings' });
    await userEvent.click(saveButton);

    expect(saveSettings).toHaveBeenCalledWith({ uid, settings: newSettings });
    expect(mockClose).toHaveBeenCalled();
  });
});
