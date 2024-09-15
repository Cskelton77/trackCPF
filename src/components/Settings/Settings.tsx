import { useContext, useEffect, useState } from 'react';
import Modal, { ModalInterface } from '../_Modal/Modal';
import {
  Actions,
  AppSettings,
  RadioButton,
  DiscardAction,
  HeightInput,
  PersonalInfo,
  SaveAction,
  SettingsSection,
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
export const Settings = ({ title, close, isVisible, uid }: Settings) => {
  const context = useContext(SettingsContext);
  console.log('context', context);
  const [gender, setGender] = useState<Genders>(context.gender);
  const [age, setAge] = useState<number>(context.age);
  const [heightFeet, setHeightFeet] = useState<number>(context.heightFeet);
  const [heightInches, setHeightInches] = useState<number>(context.heightInches);
  const [weight, setWeight] = useState<number>(context.weight);
  const [protein, setProtein] = useState<ProteinCalculation>(context.protein);
  const [rounding, setRounding] = useState<boolean>(context.rounding);
  const [usePlantPoints, setUsePlantPoints] = useState<boolean>(context.usePlantPoints);

  useEffect(() => {
    setGender(context.gender);
    setAge(context.age);
    setHeightFeet(context.heightFeet);
    setHeightInches(context.heightInches);
    setWeight(context.weight);
    setProtein(context.protein);
    setRounding(context.rounding);
    setUsePlantPoints(context.usePlantPoints);
  }, [context]);

  const handleSubmit = async () => {
    const settings = {
      gender,
      age,
      heightInches,
      heightFeet,
      weight,
      protein,
      rounding,
      usePlantPoints,
    };
    await saveSettings(uid, settings);
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
            <RadioButton
              type="radio"
              checked={gender === GENDER.MALE}
              value={GENDER.MALE}
              onChange={(e) => setGender(GENDER.MALE)}
            />{' '}
            Male <br />
            <RadioButton
              type="radio"
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
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
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
                onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
              />{' '}
              feet,{' '}
              <HeightInput
                maxLength={2}
                inputMode="decimal"
                value={heightInches}
                onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
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
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
              />{' '}
              lbs.
            </h4>
          </SettingsSection>
        </PersonalInfo>

        <AppSettings>
          <SettingsSection>
            <h4>Protein Calculation Settings:</h4>
            <RadioButton
              type="radio"
              name="protein"
              value={PROTEIN_CALCULATION.CONSERVATIVE}
              checked={protein == PROTEIN_CALCULATION.CONSERVATIVE}
              onChange={(e) => setProtein(PROTEIN_CALCULATION.CONSERVATIVE)}
              defaultChecked
            />{' '}
            Conservative (Default) <br />
            <RadioButton
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
            <RadioButton
              type="radio"
              value={'false'}
              checked={rounding == false}
              onChange={() => setRounding(false)}
              defaultChecked
            />{' '}
            Two decimal places (Default)
            <br />
            <RadioButton
              type="radio"
              value={'true'}
              checked={rounding == true}
              onChange={() => setRounding(true)}
            />{' '}
            Whole numbers
          </SettingsSection>

          <SettingsSection>
            <h4>Enable Plant Points Feature:</h4>
            <RadioButton
              type="radio"
              value={'true'}
              checked={usePlantPoints == true}
              onChange={() => setUsePlantPoints(true)}
              defaultChecked
            />{' '}
            Yes (Default)
            <br />
            <RadioButton
              type="radio"
              value={'false'}
              checked={usePlantPoints == false}
              onChange={() => setUsePlantPoints(false)}
            />{' '}
            No
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
