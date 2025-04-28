import { usePageMoveStore } from '@repo/shared-state';

const UserGroup = () => {
  const { pageMove } = usePageMoveStore(s => s);

  const onClick = () => {
    pageMove('/admin/permission');
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