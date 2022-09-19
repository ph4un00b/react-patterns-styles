import * as React from 'react';
import create from 'zustand';

function useCombined() {
  return useStore((state) => state.color1 + state.color2);
}

function Parent() {
  return (
    <div>
      <div>
        <h2>Zustand</h2>
        <small>manual optimized by selectors</small>
        <br />
        <small>push mutation driven by inmutability</small>
      </div>
      <ul>
        <li>
          <TestInputs />
        </li>
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

function TestInputs() {
  will_rerender_in_every_change: {
    var [color1] = useColor1();
    var [color2] = useColor2();
  }

  will_rerender_if_derived_state_changed: {
    var derivedState = useCombined();
  }

  return (
    <div>
      <p>derived: {color1 + color2}</p>
      <p>derived combined: {derivedState}</p>
      <p>computed: {useStore((s) => s.intensiveComputation)}</p>
    </div>
  );
}

export default function ZustandStore() {
  return <Parent />;
}

type MyGlobalState = {
  color1: string;
  color2: string;
  intensiveComputation: string;
  changecolor1: (value: string) => void;
  changecolor2: (value: string) => void;
};

var useStore = create<MyGlobalState>((set) => ({
  color1: 'red',
  color2: 'peru',
  intensiveComputation: 'redperu',
  changecolor1: (value) =>
    set((prev) => ({
      ...prev,
      color1: value,
      intensiveComputation: value + prev.color2,
    })),
  changecolor2: (value) =>
    set((prev) => ({
      ...prev,
      color2: value,
      intensiveComputation: prev.color1 + value,
    })),
}));

var MemoColor1 = React.memo(Color1);

function useColor1() {
  without_function_props: {
    const state = useStore((state) => state.color1);
    return [state, useStore.setState] as const;
  }
}

function Color1() {
  const [color1, setState] = useColor1();
  const render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={color1}
        onChange={(e) => {
          setState((prev) => ({
            ...prev,
            color1: e.target.value,
            intensiveComputation: e.target.value + prev.color2,
          }));
        }}
      />
      <div style={{ color: color1 }}>
        hey! {color1}, renders {render_count.current} times!
      </div>
    </div>
  );
}

var MemoColor2 = React.memo(Color2);

function useColor2() {
  with_function_properties: {
    const state = useStore((state) => state.color2);
    const setState = useStore((state) => state.changecolor2);
    return [state, setState] as const;
  }
}

function Color2() {
  const [color2, setState] = useColor2();
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={color2}
        onChange={(e) => {
          setState(e.target.value);
        }}
      />
      <div style={{ color: color2 }}>
        hey! {color2}, renders {render_count.current} times!
      </div>
    </div>
  );
}
