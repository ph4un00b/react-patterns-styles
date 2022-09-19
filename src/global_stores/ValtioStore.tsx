import * as React from 'react';
import { proxy, useSnapshot } from 'valtio';

var state = proxy({
  color1: 'red',
  color2: 'peru',
});

function useCombined() {
  const snap = useSnapshot(state);
  return snap.color1 + snap.color2;
}

function Parent() {
  return (
    <div>
      <div>
        <h2>Valtio</h2>
        <small>rerenders based on changes</small>
        <br />
        <small>push mutation driven by mutation access</small>
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
  var [color1] = useColor1();
  var [color2] = useColor2();

  var derivedState = useCombined();

  return (
    <div>
      <p>derived: {color1 + color2}</p>
      <p>derived combined: {derivedState}</p>
    </div>
  );
}

export default function ValtioStore() {
  return <Parent />;
}

var MemoColor1 = React.memo(Color1);

function useColor1() {
  const snap = useSnapshot(state);
  return [
    snap.color1,
    (value) => {
      state.color1 = value;
    },
  ] as const;
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
  const snap = useSnapshot(state);
  return [
    snap.color2,
    (value) => {
      state.color2 = value;
    },
  ] as const;
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
