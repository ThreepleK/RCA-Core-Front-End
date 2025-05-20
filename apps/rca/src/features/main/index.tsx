import { useRouterStore } from '@repo/shared-state';
import { useState } from 'react';

export default function Test() {
  const [cnt, setCnt] = useState(0);
  const { pageMove } = useRouterStore(s => s);
      
  const onClick = () => {
    pageMove({
      label: 'Rca test',
      path: '/rca/test',
      type: 'tab',
    });
  }


  return (
    <div>
      <p>현재 경로: {location.pathname}</p>
      <button onClick={onClick}>Go to Test</button>
      <button onClick={() => { setCnt(cnt+1) }}>{cnt}</button>
    </div>
  );
}