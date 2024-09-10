import { useContext, useState } from 'react';
import Modal, { ModalInterface } from '../_Modal/Modal';
import {
  Actions,
  AppSettings,
  Checkbox,
  DiscardAction,
  HeightInput,
  PersonalInfo,
  SaveAction,
  SettingsSection,
  WeightInput,
} from './Settings.style';
import saveSettings from '@/api/users/settings/post';
import {
  GENDER,
  Genders,
  PROTEIN_CALCULATION,
  ProteinCalculation,
  SettingsContext,
} from '@/context';

interface Settings extends Omit<ModalInterface, 'children'> {
  uid: string;
}

// Men: BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years)
// Women: BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)

//
export const Settings = ({ title, close, isVisible, uid }: Settings) => {
  const context = useContext(SettingsContext);

  const [gender, setGender] = useState<Genders>(context.gender);
  const [age, setAge] = useState<number>(context.age);
  const [heightFeet, setHeightFeet] = useState<number>(context.heightFeet);
  const [heightInches, setHeightInches] = useState<number>(context.heightInches);
  const [weight, setWeight] = useState<number>(context.weight);
  const [protein, setProtein] = useState<ProteinCalculation>(context.protein);
  const [rounding, setRounding] = useState<boolean>(context.rounding);

  const handleSubmit = () => {
    const settings = {
      gender,
      age,
      heightInches,
      heightFeet,
      weight,
      protein,
      rounding,
    };
    saveSettings(uid, settings);
    if (close) {
      close();
    }
  };

  return (
    <Modal title={title} isVisible={isVisible} close={close}>
      <form action={handleSubmit}>
        <PersonalInfo>
          <SettingsSection>
            <h4>I am :</h4>
            <Checkbox
              type="radio"
              name="gender"
              checked={gender === GENDER.MALE}
              value={GENDER.MALE}
              onChange={(e) => setGender(GENDER.MALE)}
            />{' '}
            Male <br />
            <Checkbox
              type="radio"
              name="gender"
              value={gender}
              checked={gender === GENDER.FEMALE}
              value={GENDER.FEMALE}
              onChange={(e) => setGender(GENDER.FEMALE)}
            />{' '}
            Female <br />
          </SettingsSection>
          <SettingsSection>
            <h4>
              My age is:
              <HeightInput
                maxLength={2}
                inputMode="decimal"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
              />
            </h4>
          </SettingsSection>
          <SettingsSection>
            <h4>
              My height is:
              <HeightInput
                maxLength={2}
                inputMode="decimal"
                value={heightFeet}
                onChange={(e) => setHeightFeet(parseInt(e.target.value))}
              />{' '}
              feet,{' '}
              <HeightInput
                maxLength={2}
                inputMode="decimal"
                value={heightInches}
                onChange={(e) => setHeightInches(parseInt(e.target.value))}
              />{' '}
              inches.
            </h4>
          </SettingsSection>
          <SettingsSection>
            <h4>
              My weight is:
              <HeightInput
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
              />{' '}
              lbs.
            </h4>
          </SettingsSection>
        </PersonalInfo>

        <AppSettings>
          <SettingsSection>
            <h4>Protein Calculation Settings:</h4>
            <Checkbox
              type="radio"
              name="protein"
              value={PROTEIN_CALCULATION.CONSERVATIVE}
              checked={protein == PROTEIN_CALCULATION.CONSERVATIVE}
              onChange={(e) => setProtein(PROTEIN_CALCULATION.CONSERVATIVE)}
              defaultChecked
            />{' '}
            Conservative (Default) <br />
            <Checkbox
              type="radio"
              name="protein"
              value={PROTEIN_CALCULATION.AGGRESSIVE}
              checked={protein == PROTEIN_CALCULATION.AGGRESSIVE}
              onChange={(e) => setProtein(PROTEIN_CALCULATION.AGGRESSIVE)}
            />{' '}
            Aggressive
          </SettingsSection>
          <SettingsSection>
            <h4>Round my numbers:</h4>
            <Checkbox
              type="radio"
              name="rounding"
              value={false}
              checked={rounding == false}
              onChange={() => setRounding(false)}
              defaultChecked
            />{' '}
            Two decimal places (Default)
            <br />
            <Checkbox
              type="radio"
              name="rounding"
              value={true}
              checked={rounding == true}
              onChange={() => setRounding(true)}
            />{' '}
            Whole numbers
          </SettingsSection>
        </AppSettings>

        <Actions>
          <DiscardAction onClick={close}>{'Discard'}</DiscardAction>
          <SaveAction type={'submit'} disabled={false}>
            {'Save'}
          </SaveAction>
        </Actions>
      </form>
    </Modal>
  );
};
