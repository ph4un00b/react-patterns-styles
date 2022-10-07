import * as React from 'react';
import ContextPropagation from './vanilla_stores/ContextPropagation';
import ContextWithObjects from './vanilla_stores/ContextWithObjects';
import RefactorCtxStates from './vanilla_stores/RefactorCtxStates';
import RefactorCtxReducer from './vanilla_stores/RefactorCtxReducer';
import RefactorLiftUpState from './vanilla_stores/RefactorLiftUpState';
import './index.css';
import UseReducer from './vanilla_stores/UseReducer';
import UseState from './vanilla_stores/UseState';
import RefactorCtxStateFactory from './vanilla_stores/RefactorCtxStateFactory';
import SingletonState from './vanilla_stores/SingletonState';
import SingletonEffectsState from './vanilla_stores/SingletonEffectsState';
import SingletonSubscriptionState from './vanilla_stores/SingletonSubscriptionState';
import SingletonSelectorState from './vanilla_stores/SingletonSelectorState';
import SingletonSelectorExternalStore from './vanilla_stores/SingletonSelectorExternalStore';
import SearchApp from './apps/SearchApp';
import MixContextSubscriptionState from './vanilla_stores/MixContextSubscriptionState';
import ZustandStore from './global_stores/ZustandStore';
import JotaiStore from './global_stores/JotaiStore';
import ValtioStore from './global_stores/ValtioStore';
import SignalsStore from './global_stores/SignalStore';
import { Counter } from './super_helpers/interval.example';

export default function App() {
  const [, rerender] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      rerender((prev) => prev + 1);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <h1>Global State Managent Tour!</h1>
      <p>From Context to Singletons, Selectors, Proxies && Atoms</p>
      <small>Start editing to see some magic happen :)</small>

      <Counter />
      <SignalsStore />
      <ValtioStore />
      <JotaiStore />
      <ZustandStore />
      <MixContextSubscriptionState />
      <SingletonSelectorExternalStore />
      <SingletonSelectorState />
      <SingletonSubscriptionState />
      <SingletonEffectsState />
      <SingletonState />
      <RefactorCtxStateFactory />
      <RefactorCtxReducer />
      <RefactorCtxStates />
      <ContextWithObjects />
      <ContextPropagation />
      <RefactorLiftUpState />
      <UseState initialCount={0} />
      <UseReducer initialCount={10} />
      <SearchApp />
    </div>
  );
}
