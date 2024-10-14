/*
 * Library for Array filtering.
 */

// Filter an array evenly up to maxItems.
// If the array is smaller than maxItems, return the array as is.
const filterArrayEvenly = (array: any[], maxItems: number) => {
  const n = array.length;
  
  if (n <= maxItems) {
    return array;
  }
  
  const step = Math.floor(n / maxItems);
  const filteredArray = [];
  
  for (let i = 0; i < n; i += step) {
    filteredArray.push(array[i]);
  
    if (filteredArray.length >= maxItems) {
      break;
    }
  }
  
  return filteredArray;
};

export { filterArrayEvenly };
