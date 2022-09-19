import * as React from 'react';
import { signal, computed } from '@preact/signals-react';

var color1Signal = signal('red');
var color2Signal = signal('peru');

var derivedcolors = computed(() => {
  return color1Signal.value + color2Signal.value;
});

function useCombined() {
  return derivedcolors;
}

function Parent() {
  return (
    <div>
      <div>
        <h2>Preact Signals</h2>
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

export default function SignalsStore() {
  return <Parent />;
}

var MemoColor1 = React.memo(Color1);

function useColor1() {
  return [
    color1Signal.value,
    (value) => {
      color1Signal.value = value;
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
  return [
    color2Signal.value,
    (value) => {
      color2Signal.value = value;
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
