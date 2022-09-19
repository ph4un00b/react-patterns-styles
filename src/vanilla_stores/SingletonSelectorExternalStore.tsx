import * as React from 'react';

function Parent() {
  return (
    <div>
      <div>
        <h2>Module Singleton External Store State</h2>
        <marquee>re-rendering specific components</marquee>
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

export default function SingletonSelectorExternalStore() {
  return <Parent />;
}

type FN = () => void;
type Store<T> = {
  fetchState: () => T;
  mutateState: (action: T | ((prev: T) => T)) => void;
  subscribe: (callback: FN) => FN;
};

function createStore<T extends unknown>(initial_state: T): Store<T> {
  let state = initial_state;
  const callbacks = new Set<FN>();

  function fetchState() {
    return state;
  }

  type SET_FN = (prev: T) => T;
  function mutateState(next_state: T | SET_FN) {
    state =
      typeof next_state == 'function'
        ? (next_state as SET_FN)(state)
        : next_state;

    callbacks.forEach((callback) => callback());
  }

  function subscribe(callback: () => void) {
    callbacks.add(callback);
    console.log('fns size:', callbacks.size);
    return () => callbacks.delete(callback);
  }

  return {
    fetchState,
    mutateState,
    subscribe,
  } as const;
}

var store = createStore({ color1: 'red', color2: 'peru' });

function useExternalStoreSelector<T, S>(
  store: Store<T>,
  selector: (state: T) => S
) {
  return React.useSyncExternalStore(store.subscribe, () =>
    selector(store.fetchState())
  );
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  external_store_auto_memoize: {
    var selector = (state) => state.color1;
  }

  const state = useExternalStoreSelector(store, selector);
  const render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={state}
        onChange={(e) => {
          store.mutateState((prev) => ({ ...prev, color1: e.target.value }));
        }}
      />
      <div style={{ color: state }}>
        hey! {state}, renders {render_count.current} times!
      </div>
    </div>
  );
}

var MemoColor2 = React.memo(Color2);

function Color2() {
  var state = useExternalStoreSelector(store, (state) => state.color2);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={state}
        onChange={(e) => {
          store.mutateState((prev) => ({ ...prev, color2: e.target.value }));
        }}
      />
      <div style={{ color: state }}>
        hey! {state}, renders {render_count.current} times!
      </div>
    </div>
  );
}
