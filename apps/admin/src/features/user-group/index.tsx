import { useNavigate } from 'react-router-dom';

const UserGroup = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/admin/permission');
  }

  return <>
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>User Group</h1>
        <button onClick={onClick}>클릭</button>
      </div>
    </div>
  </>;
}

export default UserGroup;