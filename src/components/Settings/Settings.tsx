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
import { saveSettings } from '@/api/users/settings/post';
import {
  GENDER,
  Genders,
  PROTEIN_CALCULATION,
  ProteinCalculation,
  SettingsContext,
} from '@/context';

interface SettingsInterface extends Omit<ModalInterface, 'children'> {
  uid: string;
}
const Settings = ({ title, close, isVisible, uid }: SettingsInterface) => {
  const context = useContext(SettingsContext);
  const [gender, setGender] = useState<Genders>(context.gender);
  const [age, setAge] = useState<number>(context.age);
  const [heightFeet, setHeightFeet] = useState<number>(context.heightFeet);
  const [heightInches, setHeightInches] = useState<number>(context.heightInches);
  const [weight, setWeight] = useState<number>(context.weight);
  const [protein, setProtein] = useState<ProteinCalculation>(context.protein);
  const [rounding, setRounding] = useState<boolean>(context.rounding);
  const [personaliseFibre, setPersonaliseFibre] = useState<boolean>(context.personaliseFibre);
  const [usePlantPoints, setUsePlantPoints] = useState<boolean>(context.usePlantPoints);

  useEffect(() => {
    setGender(context.gender);
    setAge(context.age);
    setHeightFeet(context.heightFeet);
    setHeightInches(context.heightInches);
    setWeight(context.weight);
    setProtein(context.protein);
    setRounding(context.rounding);
    setPersonaliseFibre(context.personaliseFibre);
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
      personaliseFibre,
      usePlantPoints,
    };
    await saveSettings({ uid, settings });
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
              name="gender"
              checked={gender === GENDER.MALE}
              value={GENDER.MALE}
              onChange={(e) => setGender(GENDER.MALE)}
              aria-labelledby="male"
            />{' '}
            <label id="male">Male</label> <br />
            <RadioButton
              type="radio"
              name="gender"
              checked={gender === GENDER.FEMALE}
              value={GENDER.FEMALE}
              onChange={(e) => setGender(GENDER.FEMALE)}
              aria-labelledby="female"
            />{' '}
            <label id="female">Female</label>
            <br />
          </SettingsSection>
          <SettingsSection>
            <h4>
              <label id="age">My age is:</label>
              <HeightInput
                aria-labelledby="age"
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
                aria-label="Height in feet"
                maxLength={2}
                inputMode="decimal"
                value={heightFeet}
                onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
              />{' '}
              feet,{' '}
              <HeightInput
                aria-label="Height in inches"
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
              <label id="weight">My weight is:</label>
              <HeightInput
                aria-labelledby="weight"
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
              aria-label="conservative protein calculation"
            />{' '}
            Conservative (Default) <br />
            <RadioButton
              type="radio"
              name="protein"
              value={PROTEIN_CALCULATION.AGGRESSIVE}
              checked={protein == PROTEIN_CALCULATION.AGGRESSIVE}
              onChange={(e) => setProtein(PROTEIN_CALCULATION.AGGRESSIVE)}
              aria-label="aggressive protein calculation"
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
              aria-label="display numbers to two decimals"
            />{' '}
            Two decimal places (Default)
            <br />
            <RadioButton
              type="radio"
              value={'true'}
              checked={rounding == true}
              onChange={() => setRounding(true)}
              aria-label="round to whole numbers"
            />{' '}
            Whole numbers
          </SettingsSection>

          <SettingsSection>
            <h4>Personalise Fibre Goal by Calories:</h4>
            <RadioButton
              type="radio"
              value={'true'}
              checked={personaliseFibre == true}
              onChange={() => setPersonaliseFibre(true)}
              aria-label="Personalise Fibre Goal"
            />{' '}
            Personalise Fibre (14g/1000kcal) (Default)
            <br />
            <RadioButton
              type="radio"
              value={'false'}
              checked={personaliseFibre == false}
              onChange={() => setPersonaliseFibre(false)}
              aria-label="Use NHS Recommended Fibre"
            />{' '}
            Use NHS Fibre Recommendation (30g/day)
          </SettingsSection>

          <SettingsSection>
            <h4>Enable Plant Points Feature:</h4>
            <RadioButton
              type="radio"
              value={'true'}
              checked={usePlantPoints == true}
              onChange={() => setUsePlantPoints(true)}
              aria-label="Enable plant points feature"
              //   defaultChecked
            />{' '}
            Yes (Default)
            <br />
            <RadioButton
              type="radio"
              value={'false'}
              checked={usePlantPoints == false}
              onChange={() => setUsePlantPoints(false)}
              aria-label="Disable plant points feature"
            />{' '}
            No
          </SettingsSection>
        </AppSettings>

        <Actions>
          <DiscardAction aria-label="discard changes" onClick={close}>
            {'Discard'}
          </DiscardAction>
          <SaveAction aria-label="save settings" type={'submit'} disabled={false}>
            {'Save'}
          </SaveAction>
        </Actions>
      </form>
    </Modal>
  );
};

export default Settings;
