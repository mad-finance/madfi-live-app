import { ReactElement, useState } from "react";

export function useMultiStepForm(steps: ReactElement[]) {
  const [currenStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    currenStepIndex,
    step: steps[currenStepIndex],
    goTo,
    next,
    back,
    steps,
    isFirstStep: currenStepIndex === 0,
    isLastStep: currenStepIndex === steps.length - 1,
  };
}
