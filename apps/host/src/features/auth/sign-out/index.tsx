import { useUserStore } from '@repo/shared-state'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

export default function SignOut(){
  const navigate = useNavigate();

  //* 로그인 관련 스토어
  const {logout} = useUserStore((state) => state);
  const isLogin = useUserStore((state) => state.isLogin());

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    // 로그인 중이라면 로그아웃 처리
    if( isLogin ){
      logout();
    }

    // 모달창 열기
    open();
  }, [isLogin]);

  const onClose = () => {
    // 모달창 닫기
    close();

    // 로그인 페이지로 이동
    navigate('/sign-in');
  }

  return <>
    <Modal opened={opened} onClose={onClose} withCloseButton={false}>
      <div className='flex gap-2'>
        <IconLogout />You have been sign-out.
      </div>
    </Modal>
  </>;
}