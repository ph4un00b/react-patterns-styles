import * as React from 'react';

function init(count) {
  return { count };
}

function reducer(prev, delta) {
  return { ...prev, count: prev.count + delta };
}

export default function UseState({ initialCount }) {
  const [state, setState] = useState(init(initialCount));

  function dispatch(delta) {
    return setState((prev) => reducer(prev, delta));
  }

  return (
    <div>
      <h2>UseReducer as UseState</h2>
      <div>count: {state.count}</div>
      <button onClick={() => dispatch(1)}>add with useState</button>
    </div>
  );
}

function useState(initial_state: any) {
  // console.log({ initial_state });
  var [state, dispatch] = React.useReducer((prev, action) => {
    // if (typeof action == 'function') {
    //   console.log(prev);
    //   console.log('fn', action(prev));
    // } else {
    //   console.log('action', action);
    //   action;
    // }
    return typeof action == 'function' ? action(prev) : action;
  }, initial_state);
  return [state, dispatch];
}
