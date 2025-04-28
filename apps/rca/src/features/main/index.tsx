// import { useRouterDomStore } from '@repo/shared-state'

export default function Test() {
  const onClick = () => {
    // console.log('클릭',useRouterDomStore.getState().call);
    // useRouterDomStore.getState().call('navigate', '/rca/test');
  }

  return (
    <div>
      <p>현재 경로: {location.pathname}</p>
      <button onClick={onClick}>Go to Test</button>
    </div>
  );
}