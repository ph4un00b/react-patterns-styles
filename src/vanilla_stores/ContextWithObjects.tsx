import * as React from 'react';

function Parent() {
  return (
    <ul>
      <li>
        <ParentAndContextChangesCauseRenders2 />
      </li>
      <li>
        <MemoParentAndContextChangesCauseRenders2 />
      </li>
      <li>
        <ParentAndContextChangesCauseRenders1 />
      </li>
      <li>
        <MemoParentAndContextChangesCauseRenders1 />
      </li>
    </ul>
  );
}

var ColourContext = React.createContext({ color1: 'black', color2: 'black' });
// var ColourContext = React.createContext( ['black','black' ]);

export default function ContextWithObjects() {
  var [color1, setColor1] = React.useState('red');
  var [color2, setColor2] = React.useState('peru');
  return (
    <ColourContext.Provider value={{ color1, color2 }}>
      <h2>Context & Object Limitations</h2>
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
      <Parent />
    </ColourContext.Provider>
  );
}

var MemoParentAndContextChangesCauseRenders1 = React.memo(
  ParentAndContextChangesCauseRenders1
);

function ParentAndContextChangesCauseRenders1() {
  var { color1 } = React.useContext(ColourContext);
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

var MemoParentAndContextChangesCauseRenders2 = React.memo(
  ParentAndContextChangesCauseRenders2
);

function ParentAndContextChangesCauseRenders2() {
  var { color2 } = React.useContext(ColourContext);
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
