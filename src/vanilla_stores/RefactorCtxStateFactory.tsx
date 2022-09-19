import * as React from 'react';

function createStateContext<VALUE, STATE>(
  useValue: (initial_value?: VALUE) => STATE
) {
  var StateContext = React.createContext<STATE | null>(null);

  return [StateProvider, useContextState] as const;

  function useContextState() {
    const value = React.useContext(StateContext);
    if (value == null) throw new Error('I need a Provider!');
    return value;
  }

  function StateProvider({
    initialValue,
    children,
  }: {
    initialValue?: VALUE;
    children: React.ReactNode;
  }) {
    return (
      <StateContext.Provider value={useValue(initialValue)}>
        {children}
      </StateContext.Provider>
    );
  }
}

var useColorState = (init?: string) => React.useState(init || 'black');

function useComplexState(init = { color1: 'red', color2: 'peru' }) {
  const [state, setState] = React.useState(init);

  React.useEffect(() => {
    // console.log('Complex state updated!');
  });

  const changeColor1 = React.useCallback((newState: string) => {
    setState((prev) => ({ ...prev, color1: newState }));
  }, []);

  const changeColor2 = React.useCallback((newState: string) => {
    setState((prev) => ({ ...prev, color2: newState }));
  }, []);

  return [state, { changeColor1, changeColor2 }] as const;
}

primitive_state: {
  var [Color1Provider, useColor1] = createStateContext(useColorState);
  var [Color2Provider, useColor2] = createStateContext(useColorState);
}

var [ComplexProvider, useComplexColor] = createStateContext(useComplexState);

function Parent() {
  return (
    <div>
      <Inputs />
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

export default function RefactorCtxStateFactory() {
  avoid_provider_nesting: {
    var providers = [
      [Color1Provider, { initialValue: 'red' }],
      [Color2Provider, { initialValue: 'peru' }],
      [ComplexProvider],
    ] as const;

    return providers.reduceRight(
      (children, [Component, props]) =>
        React.createElement(Component, props, children),
      <Parent />
    );
  }

  return (
    <Color1Provider initialValue={'red'}>
      <Color2Provider initialValue={'peru'}>
        <Parent />
      </Color2Provider>
    </Color1Provider>
  );
}

function Inputs() {
  var [color1, setColor1] = useColor1();
  with_primitive_value: {
    const [color2, setColor2] = useColor2();
  }
  var [state, setters] = useComplexColor();
  return (
    <div>
      <h2>Refactor Context & Small States with Factory</h2>
      <input
        type="text"
        value={color1}
        onChange={(e) => setColor1(e.target.value)}
      />
      <input
        type="text"
        value={state.color2}
        onChange={(e) => setters.changeColor2(e.target.value)}
      />
    </div>
  );
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  var [color1] = useColor1();
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div style={{ color: color1 }}>
      hey! {color1}, renders {render_count.current} times!
    </div>
  );
}

var MemoColor2 = React.memo(Color2);

function Color2() {
  with_primitive_state: {
    const [color2] = useColor2();
  }
  var [state] = useComplexColor();

  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div style={{ color: state.color2 }}>
      hey! {state.color2}, renders {render_count.current} times!
    </div>
  );
}
