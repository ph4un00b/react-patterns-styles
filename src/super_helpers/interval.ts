import { useEffect, useRef } from 'react';

/** @link https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>(null!);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
