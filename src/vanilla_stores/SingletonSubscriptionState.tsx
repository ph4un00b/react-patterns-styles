import * as React from 'react';

type FN = () => void;
type Store<T> = {
  getState: () => T;
  setState: (action: T | ((prev: T) => T)) => void;
  subscribe: (callback: FN) => FN;
};

function createStore<T extends unknown>(initial_state: T): Store<T> {
  let state = initial_state;
  const callbacks = new Set<() => void>();

  function getState() {
    return state;
  }

  type SET_FN = (prev: T) => T;
  function setState(next_state: T | SET_FN) {
    state =
      typeof next_state == 'function'
        ? (next_state as SET_FN)(state)
        : next_state;

    callbacks.forEach((callback) => callback());
  }

  function subscribe(callback: () => void) {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  }

  return {
    getState,
    setState,
    subscribe,
  } as const;
}

var store = createStore({ color: 'red' });
// console.log(store.getState());
store.setState({ color: 'black' });
// console.log(store.getState());

function useStore<T>(store: Store<T>) {
  const [state, setState] = React.useState(store.getState());

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });

    handling_useeffect_delay: {
      // console.log('useeffect special case!');
      setState(store.getState());
    }

    return unsubscribe;
  }, [store]);

  return [state, store.setState] as const;
}

function Parent() {
  return (
    <div>
      <div>
        <h2>Module Singleton Store Subscription State</h2>
        <marquee>re-rendering all components</marquee>
      </div>
      <ul>
        <li>
          <Color1 />
        </li>
        <li>
          <MemoColor1 />
        </li>
        <li>
          <Color2 />
        </li>
        <li>
          <MemoColor2 />
        </li>
      </ul>
    </div>
  );
}

export default function SingletonEffectsState() {
  return <Parent />;
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  var [state, setColor1] = useStore(store);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={state.color}
        onChange={(e) => {
          setColor1((prev) => ({ ...prev, color: e.target.value }));
        }}
      />
      <div style={{ color: state.color }}>
        hey! {state.color}, renders {render_count.current} times!
      </div>
    </div>
  );
}

var MemoColor2 = React.memo(Color2);

function Color2() {
  var [state, setColor2] = useStore(store);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={state.color}
        onChange={(e) => {
          setColor2((prev) => ({ ...prev, color: e.target.value }));
        }}
      />
      <div style={{ color: state.color }}>
        hey! {state.color}, renders {render_count.current} times!
      </div>
    </div>
  );
}
