import * as React from 'react';

type Action =
  | { type: 'BOTH'; state: string }
  | { type: 'COLOR1'; state: string }
  | { type: 'COLOR2'; state: string };

var ColourContext1 = React.createContext<string | null>(null);
var ColourContext2 = React.createContext<string>('black');
var DispatcherContext = React.createContext<React.Dispatch<Action>>(() => {});

function Provider({ children }: { children: React.ReactNode }) {
  var [state, dispatch] = React.useReducer(
    (prev: { color1: string; color2: string }, action: Action) => {
      if (action.type == 'COLOR2') {
        return { ...prev, color2: action.state };
      }

      if (action.type == 'COLOR1') {
        return { ...prev, color1: action.state };
      }

      only_possible_with_reducer: {
        if (action.type == 'BOTH') {
          return { ...prev, color1: action.state, color2: action.state };
        }
      }

      console.log('no matching!');
    },
    {
      color1: 'red',
      color2: 'peru',
    }
  );

  return (
    <DispatcherContext.Provider value={dispatch}>
      <ColourContext1.Provider value={state.color1}>
        <ColourContext2.Provider value={state.color2}>
          {children}
        </ColourContext2.Provider>
      </ColourContext1.Provider>
    </DispatcherContext.Provider>
  );
}

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

export default function RefactorCtxReducer() {
  return (
    <Provider>
      <Parent />
    </Provider>
  );
}

function Inputs() {
  var color1 = React.useContext(ColourContext1);
  var color2 = React.useContext(ColourContext2);
  var dispatch = React.useContext(DispatcherContext);
  return (
    <div>
      <h2>Context & Small Chunks & Reducer</h2>
      <input
        type="text"
        value={color1}
        onChange={(e) => dispatch({ type: 'COLOR1', state: e.target.value })}
      />

      <input
        type="text"
        value={color2}
        onChange={(e) => dispatch({ type: 'COLOR2', state: e.target.value })}
      />
    </div>
  );
}

var MemoColor1 = React.memo(Color1);

refactor_as_hook: {
  var useColor1 = () => {
    var color1 = React.useContext(ColourContext1);
    if (color1 == null) throw new Error('Missing provider!');
    return color1;
  };
}

function Color1() {
  explicit_context: {
    const color1 = React.useContext(ColourContext1);
  }

  refactor_as_hook: {
    var color1 = useColor1();
  }

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
  var color2 = React.useContext(ColourContext2);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div style={{ color: color2 }}>
      hey! {color2}, renders {render_count.current} times!
    </div>
  );
}
