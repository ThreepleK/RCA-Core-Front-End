import { redirect } from 'react-router';
import { useUserStore } from '@repo/shared-state';

export async function protectedLoader(){
    // 로그인 여부 가져오기
    const isLogin = useUserStore.getState().isLogin();

    // 로그인 중이 아니라면 로그인 페이지로 이동
    if( !isLogin ){
        return redirect('/sign-in');
    }

    // 로그인 상태면
    return null;
}
