import * as React from 'react';

var color = 'black';
var EffectsFns = new Set<(color: string) => void>();

function Parent() {
  return (
    <div>
      <div>
        <h2>Singleton Effects State</h2>
        <marquee>re-rendering all components</marquee>
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

export default function SingletonEffectsState() {
  return <Parent />;
}

var MemoColor1 = React.memo(Color1);

function Color1() {
  var [color1, setColor1] = React.useState(color);
  var render_count = React.useRef(1);

  React.useEffect(() => {
    EffectsFns.add(setColor1);
    return () => {
      EffectsFns.delete(setColor1);
    };
  }, []);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={color1}
        onChange={(e) =>
          EffectsFns.forEach((fn) => {
            fn(e.target.value);
          })
        }
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
    EffectsFns.add(setColor2);
    return () => {
      EffectsFns.delete(setColor2);
    };
  }, []);

  React.useEffect(() => {
    render_count.current += 1;
  });

  return (
    <div>
      <input
        type="text"
        value={color2}
        onChange={(e) =>
          EffectsFns.forEach((fn) => {
            fn(e.target.value);
          })
        }
      />
      <div style={{ color: color2 }}>
        hey! {color2}, renders {render_count.current} times!
      </div>
    </div>
  );
}
