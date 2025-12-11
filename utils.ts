import { Option, Question } from "./types";

/**
 * 洗牌算法
 * @param array 要打乱的数组
 * @returns 返回打乱后的数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function prepareQuiz(questions: Question[], isRandom: boolean, limit?: number): Question[] {
  let processedQuestions = isRandom ? shuffleArray(questions) : [...questions];

  if (limit && limit > 0) {
    processedQuestions = processedQuestions.slice(0, limit);
  }

  if (isRandom) {
    processedQuestions = processedQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }

  return processedQuestions;
}

export const generateId = () => Math.random().toString(36).substr(2, 9);