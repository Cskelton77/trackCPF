// Diary API Calls
const handleSaveDiaryEntry = async (
  name: string,
  serving: number,
  calories: NullableNumber,
  protein: NullableNumber,
  fibre: NullableNumber,
  plantPoints: NullableNumber,
) => {
  // Add a new diary item with a food that should be saved to food DB
  const isCompleteEntry = calories !== null && protein !== null && fibre !== null;
  console.log('isCompleteEntry', isCompleteEntry);
  const isManualMode = newItemMode === MODES.MANUAL;
  const isUpdateMode = newItemMode === MODES.UPDATE;
  const isCalculateMode = newItemMode === MODES.CALCULATE && selectedFood;
  // Complete Entry means we have a full piece of food
  // Not manual mode means we can save info for /100g
  // Not update mode means we are going to PUT not PATCH
  // No selected food means we did not select an item from the existing dropdown
  if (isCompleteEntry && !isManualMode && !isUpdateMode && !selectedFood) {
    // Save full nutritional data per 100g'
    const newFood = JSON.parse(
      await postFood(uid, {
        name: name,
        calories: calories,
        protein: protein,
        fibre: fibre,
        plantPoints: plantPoints || 0,
      }),
    );
    const diaryEntry: Omit<DiaryData, 'did'> = {
      uid,
      date: moment(displayDate).format('YYYY-MM-DD'),
      serving: serving || 0,
      isDirectEntry: isManualMode,
      foodEntry: {
        fid: newFood?.fid || '',
        name: name,
        calories: calories as number,
        protein: protein as number,
        fibre: fibre as number,
        plantPoints: plantPoints as number,
      },
    };
    await postDiary(diaryEntry);
  }

  // Update an existing diary item
  // isUpdateMode
  if (isUpdateMode) {
    const diaryUpdate: Partial<DiaryData> = {
      did: selectedDiaryEntry,
      uid,
      serving,
      foodEntry: {
        fid: selectedFood?.fid || '',
        name: selectedFood?.name || 'error',
        calories: calories as number,
        protein: protein as number,
        fibre: fibre as number,
        plantPoints: plantPoints as number,
      },
    };
    await updateDiary(diaryUpdate);
  }

  // add a new diary item with a food that should not be saved
  // isManualMode
  if (isManualMode || isCalculateMode) {
    const diaryEntry: Omit<DiaryData, 'did'> = {
      uid,
      date: moment(displayDate).format('YYYY-MM-DD'),
      serving: serving || 0,
      isDirectEntry: isManualMode,
      foodEntry: {
        fid: selectedFood?.fid || '',
        name: name,
        calories: calories as number,
        protein: protein as number,
        fibre: fibre as number,
        plantPoints: plantPoints as number,
      },
    };
    await postDiary(diaryEntry);
  }

  resetSelection();
  await fetchDaily();
};
