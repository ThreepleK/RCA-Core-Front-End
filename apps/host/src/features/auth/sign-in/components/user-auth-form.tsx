import { useEffect, useState } from 'react'
import { TextInput, PasswordInput, Group, Text, Anchor, Button, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios'
import { useUserStore } from '@repo/shared-state'
import { useNavigate } from 'react-router-dom';

/**
 * 로그인 API 호출
 */
async function loginApi(id: string, pw: string){
  try {
    const res = await axios.post('/auth/api/login', {
      username: encodeURIComponent(id).trim(),
      password: encodeURIComponent(pw).trim(),
    });

    // 로그인 성공
    if( res.status === 200 ){
      return {isErr: false, msg: '', res: res.data};
    } else {
      return {isErr: true, msg: 'Login failed.', res: null};
    }

  } catch( err: any ){
    // 에러
    const errMsg = err?.response?.statusText ?? 'Login failed.';
    return {isErr: true, msg: errMsg, res: null};
  }
}

/**
 * 로그인 폼
 */
export function UserAuthForm({className}: any) {
  const navigate = useNavigate();

  //* 로그인 폼 관련
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  //* 로그인 관련 스토어
  const {login} = useUserStore((state) => state);
  const isLogin = useUserStore((state) => state.isLogin());

  useEffect(() => {
    //* 로그인 중이라면 메인 페이지로 이동
    if( isLogin ){
      navigate('/');
    }
  }, [isLogin]);

  async function onSubmit() {
    // 로딩중, alert 메시지 제거
    setIsLoading(true);
    setAlertMsg('');

    // id 입력 값이 없을 경우
    if( userId === '' ){
      setAlertMsg('Please enter your ID.');
      setIsLoading(false);
      return;
    }

    // 비번 입력 값이 없을 경우
    if( userPw === '' ){
      setAlertMsg('Please enter your Password.');
      setIsLoading(false);
      return;
    }

    // 로그인 api 요청
    const {isErr, msg, res} = await loginApi(userId, userPw);

    // 에러가 났을 경우
    if( isErr ){
      setAlertMsg(msg);
      setIsLoading(false);
      return;
    }

    // 로그인 상태 기록
    const {user, accessToken, expiresIn} = res;
    login(user, accessToken, expiresIn);
  }

  // input 엔터
  function onKeyup(e: any){
    if( e.keyCode !== 13 ){ return; }
    onSubmit();
  }
  
  return <>
    <div className={`flex flex-col gap-y-3 ${className}`}>
      {alertMsg !== '' && <Alert variant="light" color="red" icon={<IconInfoCircle />}>{alertMsg}</Alert>}
      <TextInput
        label='ID'
        autoComplete="nope"
        value={userId}
        onChange={(event) => setUserId(event.currentTarget.value)}
        onKeyUp={onKeyup}
      />
      <div>
        <Group justify="space-between" mb={5}>
          <Text component="label" htmlFor="your-password" size="sm" fw={500}>
            Your password
          </Text>

          {/* <Anchor href="#" onClick={(event) => event.preventDefault()} pt={2} fw={500} fz="xs">
            Forgot your password?
          </Anchor> */}
        </Group>
        <PasswordInput
          id="your-password"
          required
          value={userPw}
          onChange={(event) => setUserPw(event.currentTarget.value)}
          onKeyUp={onKeyup}
        />
      </div>

      <Button className='mt-2' disabled={isLoading} onClick={onSubmit}>Login</Button>
    </div>
  </>
}
