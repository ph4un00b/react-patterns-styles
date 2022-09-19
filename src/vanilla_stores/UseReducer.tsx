import * as React from 'react';

function init(count) {
  return { count };
}

function reducer(prev, delta) {
  return { ...prev, count: prev.count + delta };
}

export default function UseReducer({ initialCount }) {
  var [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <React.Fragment>
      <h2>UseState as UseReducer</h2>
      <div>count: {state.count}</div>
      <button onClick={() => dispatch(1)}>add with useReducer</button>
    </React.Fragment>
  );
}

function useReducer(reducer: any, initial_state: any, lazy_fn: any) {
  var [state, setState] = React.useState(
    !lazy_fn ? initial_state : lazy_fn(initial_state)
  );

  const dispatch = React.useCallback(
    (action) => setState((prev) => reducer(prev, action)),
    [reducer]
  );

  return [state, dispatch];

  // function dispatch(action) {
  //   setState((prev) => reducer(prev, action));
  // }
}
