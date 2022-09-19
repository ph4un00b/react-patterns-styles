import * as React from 'react';
import { atom, useAtom } from 'jotai';

var color1Atom = atom('red');
color1Atom.onMount = (set) => {
  console.log('jotai atom');
  function onUnmount() {
    console.log('jotai atom ended');
  }
  return onUnmount;
};
var color2Atom = atom('peru');
var derivedAtom = atom((get) => get(color1Atom) + get(color2Atom));
var changeColor1Action = atom(null, (get, set, value) => {
  set(color1Atom, (prev) => value as string);
});

function useCombined() {
  return useAtom(derivedAtom);
}

function Parent() {
  return (
    <div>
      <div>
        <h2>Jotai</h2>
        <small>rerenders based on deps</small>
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
      {/* <p>computed: {useStore((s) => s.intensiveComputation)}</p> */}
    </div>
  );
}

export default function JotaiStore() {
  return <Parent />;
}

var MemoColor1 = React.memo(Color1);

function useColor1() {
  const [state] = useAtom(color1Atom);
  const [, set] = useAtom(changeColor1Action);
  return [state, set] as const;
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
          setState(e.target.value);
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
  const [state, set] = useAtom(color2Atom);
  return [state, set] as const;
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
