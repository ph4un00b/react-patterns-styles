import React from 'react';

export function useDebounce(callback: () => void, delay: number) {
  const callbackRef = React.useRef(callback);
  // Why useLayoutEffect? -> https://kcd.im/uselayouteffect
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay]
  );
}

function debounce(fn: () => void, delay: number) {
  let timer: number;
  return (...args: any) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...(args as []));
    }, delay);
  };
}
