let tribe: string = 'All'; // Default value for tribe
let date: string = ''; // Default value for date

export const setData = (newTribe: string, newDate: string) => {
  tribe = newTribe;
  date = newDate;
};

export const getData = () => {
  return { tribe, date };
};