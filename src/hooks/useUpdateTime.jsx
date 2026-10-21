import {createSignal} from 'solid-js';

export const useUpdateTime = () => {
  const [updateTime, setUpdateTime] = createSignal(0);
  let measurements = [];

  const measureUpdate = (updateFunction) => {
    const start = performance.now();

    updateFunction();

    requestAnimationFrame(() => {
      const duration = performance.now() - start;

      measurements.push(duration);

      if (measurements.length > 30) {
        measurements.shift();
      }

      const average =
        measurements.reduce((sum, value) => sum + value, 0) /
        measurements.length;

      setUpdateTime(Number(average.toFixed(2)));
    });
  };

  return {
    updateTime,
    measureUpdate
  };
};