import * as React from 'react';

let color = 'black';

function Parent() {
  return (
    <div>
      <div>
        <h2>Singleton State</h2>
        <marquee>not re-rendering same components</marquee>
      </div>
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

export default function SingletonState() {
  return <Parent />;
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  var [color1, setColor1] = React.useState(color);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={color1}
        onChange={(e) => setColor1(e.target.value)}
      />
      <div style={{ color: color1 }}>
        hey! {color1}, renders {render_count.current} times!
      </div>
    </div>
  );
}

var MemoColor2 = React.memo(Color2);

function Color2() {
  var [color2, setColor2] = React.useState(color);

  var render_count = React.useRef(1);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={color2}
        onChange={(e) => setColor2(e.target.value)}
      />
      <div style={{ color: color2 }}>
        hey! {color2}, renders {render_count.current} times!
      </div>
    </div>
  );
}
