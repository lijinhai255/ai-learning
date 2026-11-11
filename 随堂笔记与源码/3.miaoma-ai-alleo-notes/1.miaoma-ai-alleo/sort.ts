function bubbleSort(numbers: number[]): number[] {
  const result = [...numbers];

  for (let i = 0; i < result.length - 1; i += 1) {
    for (let j = 0; j < result.length - 1 - i; j += 1) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}

const values = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(values));