import axios from 'axios'
import { useUserStore } from '@repo/shared-state'

export async function request({ type, url, params={}, datas={} }: {
    type: 'get'|'post';     // 요청 타입
    url: string;            // 요청 주소
    params: any;            // 요청 데이터 (url)
    datas: any;             // 요청 데이터 (body)
}) {
    try {
        // 인증토큰 가져오기
        const { token } = useUserStore.getState();

        // 요청
        const res = await axios({
            method: type,
            url,
            params: dataEncode(params),
            data: dataEncode(datas),
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

/**
 * 데이터 인코딩 처리
 */
function dataEncode(data: any) {
    // 데이터가 없을 경우
    if( !data ){ return {}; }

    // 데이터 타입 체크 (number, string, array, object)
    const typeChk = (item: any) => {
        if( Array.isArray(item) ){ return 'array'; }
        return typeof item;
    }

    // 숫자 인코딩
    const encodeNumber = (data: number) => data;
    // 문자열 인코딩
    const encodeString = (data: string) => encodeURIComponent(data);

    // 반복
    const loop = (items: any) => {
        let result: any;
        const t = typeChk(items);

        if( t === 'array' ){
            result = items.map((item: any) => {
                return loop(item);
            });
        }
        else if( t === 'object' ){
            result = {};
            for( const key in items ){
                const item = items[key];
                result[key] = loop(item);
            }
        }
        else if( t === 'number' ){
            result = encodeNumber(items);
        }
        else if( t === 'string' ){
            result = encodeString(items);
        }
        
        return result;
    }

    return loop(data);
}