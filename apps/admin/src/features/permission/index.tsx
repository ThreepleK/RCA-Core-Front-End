import { useNavigate } from 'react-router-dom';

export default function(){
  const navigate = useNavigate();

  return <>
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>Permission</h1>
      </div>
    </div>
  </>;
}