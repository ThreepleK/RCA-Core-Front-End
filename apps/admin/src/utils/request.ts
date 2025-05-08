import axios from 'axios'
import { useUserStore } from '@repo/shared-state'

export async function request(
    type: 'get'|'post',     // 요청 타입
    url: string,            // 요청 주소
    params: any = {}        // 요청 데이터
) {
    try {
        const { token } = useUserStore.getState();
        const res = await axios({
            method: type,
            url,
            params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token,
            }
        });

        // 성공
        if( res.status === 200 ){
            return {isErr: false, msg: '', res: res.data};
        } else {
            return {isErr: true, msg: 'request failed', res: null};
        }
  
    } catch( err: any ){
        console.log('err', err);
        // 에러
        const errMsg = err?.response?.statusText ?? 'request failed.';
        return {isErr: true, msg: errMsg, res: null};
    }
}