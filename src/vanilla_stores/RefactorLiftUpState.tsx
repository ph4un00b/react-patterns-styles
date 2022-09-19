import * as React from 'react';

export default function RefactorLiftUpState() {
  return (
    <div>
      <h2>lifting up state refactor</h2>
      <Parent>
        <Extra />
      </Parent>
    </div>
  );
}

function Extra() {
  return <pre>extra info</pre>;
}

refactor_with_prop: {
  function GrandParent({ extra }) {
    return <Parent extra={extra} />;
  }
}

rerendering_all: {
  function Parent() {
    var [count, setCount] = React.useState<number>(0);
    return (
      <div>
        <ChildA count={count} setState={setCount} />
        <ChildB count={count} setState={setCount} />
      </div>
    );
  }
}

refactor_with_prop: {
  function Parent({ extra }) {
    var [count, setCount] = React.useState<number>(0);
    return (
      <div>
        <ChildAWithComponent count={count} setState={setCount} extra={extra} />
        <ChildB count={count} setState={setCount} />
      </div>
    );
  }
}

function Parent({ children }) {
  var [count, setCount] = React.useState<number>(0);
  return (
    <div>
      <ChildAWithChildren count={count} setState={setCount}>
        {children}
      </ChildAWithChildren>
      <ChildB count={count} setState={setCount} />
    </div>
  );
}

rerendering_extra: {
  function ChildA({ count, setState }) {
    return (
      <div>
        <Extra />
        child a:{count}
        <button onClick={() => setState((x) => x + 1)}>add</button>
      </div>
    );
  }
}

refactor_with_prop: {
  function ChildAWithComponent({ count, setState, extra }) {
    return (
      <div>
        {extra}
        child a:{count}
        <button onClick={() => setState((x) => x + 1)}>add</button>
      </div>
    );
  }
}

function ChildAWithChildren({ count, setState, children }) {
  return (
    <div>
      {children}
      child a:{count}
      <button onClick={() => setState((x) => x + 1)}>add</button>
    </div>
  );
}

function ChildB({ count, setState }) {
  return (
    <div>
      child a:{count}
      <button onClick={() => setState((x) => x + 1)}>add</button>
    </div>
  );
}
