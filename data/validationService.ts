/* eslint-disable @typescript-eslint/no-explicit-any */

// since we usa a database without a schema it can accept any object
// this method checks if the provided object has properties required for the agenda event

const _allValuesAreValid = (
  valuesToCheck: string[],
  whiteList: string[],
): boolean => {
  const intersection = valuesToCheck.filter((value) => {
    if (!whiteList.includes(value.toString())) return false;
    return true;
  });

  return intersection.length !== valuesToCheck.length ? false : true;
};

interface NewEvent {
  [x: string]: any;
}

export function newEvent(newEventObject: NewEvent): boolean {
  // NAME
  if (
    typeof newEventObject.name === 'undefined' ||
    newEventObject.name.trim() === ''
  )
    return false;
  // END DATE
  if (
    typeof newEventObject.end === 'undefined' 
  // ||
  //   typeof newEventObject.end.getMonth !== 'function'
  )
    return false;

  // STATE
  // is not declared
  if (
    typeof newEventObject.state === 'undefined' ||
    JSON.stringify(newEventObject.state) === '{}'
  )
    return false;

  // category is not valid
  const validCategories = [
    'home',
    'current',
    'exhibitions',
    'theatreanddance',
    'music',
    'sports',
    'fairs',
    'events',
    'christmas',
  ];

  const stateCategories = Object.keys(newEventObject.state);

  if (!_allValuesAreValid(stateCategories, validCategories)) {
    return false;
  }

  // category value is not valid
  const statePropsValues = Object.keys(newEventObject.state).map(
    (stateProp) => newEventObject.state[stateProp],
  );

  if (
    !_allValuesAreValid(statePropsValues, [
      'candidate',
      'highlight',
      'mainfocus',
    ])
  )
    return false;

  // ALL GOOD!!!
  return true;
}

export const validationService = { newEvent };
