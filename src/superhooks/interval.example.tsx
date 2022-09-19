import { useState } from 'react';
import { useInterval } from './interval';

export function Counter() {
  const [delay, setDelay] = useState(1000);
  const [count, setCount] = useState(0);

  // Increment the counter.
  useInterval(() => {
    setCount(count + 1);
  }, delay);

  // Make it faster every second!
  useInterval(() => {
    if (delay > 10) {
      setDelay(delay / 2);
    }
  }, 1000);

  function handleReset() {
    setDelay(1000);
  }

  return (
    <>
      <h2>Counter: {count}</h2>
      <h4>Delay: {delay}</h4>
      <button onClick={handleReset}>Reset delay</button>
    </>
  );
}
