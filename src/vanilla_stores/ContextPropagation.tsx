import * as React from 'react';

function Parent() {
  return (
    <ul>
      <li>
        <DummyComponent />
      </li>
      <li>
        <MemoizedDummy />
      </li>
      <li>
        <ParentAndContextChangesCauseRenders />
      </li>
      <li>
        <ContextChangesCauseRenders />
      </li>
    </ul>
  );
}

export default function ContextPropagation() {
  var [color, setColor] = React.useState('red');
  return (
    <ColourContext.Provider value={color}>
      <h2>Context Propagation</h2>
      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <Parent />
    </ColourContext.Provider>
  );
}

var ColourContext = React.createContext('peru');
var ContextChangesCauseRenders = React.memo(
  ParentAndContextChangesCauseRenders
);

function ParentAndContextChangesCauseRenders() {
  var color = React.useContext(ColourContext);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div style={{ color }}>
      hey! {color}, renders {render_count.current} times!
    </div>
  );
}

var MemoizedDummy = React.memo(DummyComponent);

function DummyComponent() {
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return <div>hey! dummy, renders {render_count.current} times!</div>;
}
