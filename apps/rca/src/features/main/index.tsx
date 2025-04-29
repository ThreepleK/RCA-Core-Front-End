import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Test() {
  const [cnt, setCnt] = useState(0);
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/rca/test');
  }

  return (
    <div>
      <p>현재 경로: {location.pathname}</p>
      <button onClick={onClick}>Go to Test</button>
      <button onClick={() => { setCnt(cnt+1) }}>{cnt}</button>
    </div>
  );
}