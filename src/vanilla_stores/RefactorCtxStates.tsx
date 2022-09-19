import * as React from 'react';

type ColourContextType = [string, React.Dispatch<React.SetStateAction<string>>];

var ColourContext1 = React.createContext<ColourContextType>([
  'black',
  () => {},
]);

var ColourContext2 = React.createContext<ColourContextType>([
  'black',
  () => {},
]);

function Provider1({ children }: { children: React.ReactNode }) {
  return (
    <ColourContext1.Provider value={React.useState('red')}>
      {children}
    </ColourContext1.Provider>
  );
}

function Provider2({ children }: { children: React.ReactNode }) {
  return (
    <ColourContext2.Provider value={React.useState('peru')}>
      {children}
    </ColourContext2.Provider>
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

export default function RefactorCtxStates() {
  return (
    <Provider1>
      <Provider2>
        <Parent />
      </Provider2>
    </Provider1>
  );
}

function Inputs() {
  var [color1, setColor1] = React.useContext(ColourContext1);
  var [color2, setColor2] = React.useContext(ColourContext2);
  return (
    <div>
      <h2>Context & Small States</h2>
      <input
        type="text"
        value={color1}
        onChange={(e) => setColor1(e.target.value)}
      />
      <input
        type="text"
        value={color2}
        onChange={(e) => setColor2(e.target.value)}
      />
    </div>
  );
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  var [color1] = React.useContext(ColourContext1);
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
  var [color2] = React.useContext(ColourContext2);
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
