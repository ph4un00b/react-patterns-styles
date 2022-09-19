import * as React from 'react';

function Parent() {
  return (
    <div>
      <div>
        <h2>Mix Context with Module Subscription Store State</h2>
        <marquee>re-rendering specific components</marquee>
      </div>
      <ul>
        <li>
          <StoreProvider
            initialState={{
              color1: 'red',
              color2: 'red',
            }}
          >
            <Color1 />
          </StoreProvider>
        </li>
        <li>
          <MemoColor1 />
        </li>
        <li>
          <StoreProvider
            initialState={{
              color1: 'pink',
              color2: 'pink',
            }}
          >
            <Color2 />
          </StoreProvider>
        </li>
        <li>
          <MemoColor2 />
        </li>
      </ul>
    </div>
  );
}

export default function MixContextSubscriptionState() {
  return <Parent />;
}

type CALLBACK = () => void;
type Store<T> = {
  fetchState: () => T;
  mutateState: (action: T | ((prev: T) => T)) => void;
  subscribe: (callback: CALLBACK) => CALLBACK;
};

function createStore<T extends unknown>(initial_state: T): Store<T> {
  let state = initial_state;
  const callbacks = new Set<CALLBACK>();

  function fetchState() {
    return state;
  }

  type SET_CALLBACK = (prev: T) => T;
  function mutateState(next_state: T | SET_CALLBACK) {
    state =
      typeof next_state == 'function'
        ? (next_state as SET_CALLBACK)(state)
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

type MyGlobalState = { color1: string; color2: string };
var StoreContext = React.createContext<Store<MyGlobalState>>(
  createStore({ color1: 'black', color2: 'blue' })
);

function StoreProvider({
  initialState,
  children,
}: {
  initialState: MyGlobalState;
  children: React.ReactNode;
}) {
  const storeRef = React.useRef<Store<MyGlobalState>>();

  if (!storeRef.current) {
    storeRef.current = createStore(initialState);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

function useSelector<S extends unknown>(selector: (state: MyGlobalState) => S) {
  store_not_comming_from_arguments: {
    var store = React.useContext(StoreContext);
  }

  mixing_context_and_external_store: {
    return React.useSyncExternalStore(store.subscribe, () =>
      selector(store.fetchState())
    );
  }
}

function useSetState() {
  const store = React.useContext(StoreContext);
  return store.mutateState;
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  external_store_auto_memoize: {
    var selector = (state: MyGlobalState) => state.color1;
  }

  const state = useSelector(selector);
  avoiding_store_dependency: {
    var setState = useSetState();
  }

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
          setState((prev) => ({ ...prev, color1: e.target.value }));
        }}
      />
      <div style={{ color: state }}>
        hey! {state}, renders {render_count.current} times!
      </div>
    </div>
  );
}

var MemoColor2 = React.memo(Color2);

var selector2 = (state: MyGlobalState) => state.color2;
function Color2() {
  const state = useSelector(selector2);
  avoiding_store_dependency: {
    var setState = useSetState();
  }
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
          setState((prev) => ({ ...prev, color2: e.target.value }));
        }}
      />
      <div style={{ color: state }}>
        hey! {state}, renders {render_count.current} times!
      </div>
    </div>
  );
}
