import axios from 'axios'
import { useUserStore } from '@repo/shared-state'

interface ApiResultDefault {
    isErr: boolean;
    msg: string;
    res?: any;
}

export type ApiResult = 
    | ({
        isErr: false;
        isErrJSON?: false;
        msg: string;
    } & ApiResultDefault )  // 에러가 없을 때
    | ({
        isErr: true;
        isErrJSON?: false;
        msg: string;
    } & ApiResultDefault )  // 에러가 있을 때 (기본)
    | ({
        isErr: true;
        isErrJSON?: true;
        msg: {
            code: string;
            message: string;
        };
    } & ApiResultDefault )  // 에러 메시지가 json 포맷일 때
;

export async function request({ type, url, params={}, datas={} }: {
    type: 'get'|'post'|'put'|'delete';     // 요청 타입
    url: string;            // 요청 주소
    params?: any;           // 요청 데이터 (url)
    datas?: any;            // 요청 데이터 (body)
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
            return {isErr: false, msg: '', res: dataDecode(res.data)};
        } else {
            return {isErr: true, msg: 'request failed', res: null};
        }
  
    } catch( err: any ){
        // 500 에러일 때
        if ( err.status === 500 ){
            const jsonMsg = err?.response?.data ?? {};
            const isErrJSON = typeof jsonMsg === 'object';

            return {isErr: true, msg: jsonMsg, res: null, isErrJSON: isErrJSON};
        }

        // 에러
        const errMsg = err?.response?.statusText ?? 'request failed.';
        return {isErr: true, msg: errMsg, res: null};
    }
}

/**
 * 데이터 타입 체크 (number, string, array, object)
 */
function typeCheck(item: any){
    if( Array.isArray(item) ){ return 'array'; }
    return typeof item;
}

/**
 * 데이터 인코딩/디코딩 반복 처리
 */
function dataLoop(
    items: any,
    cb: (dataType: string, items: any) => any
){
    let result: any;
    const t = typeCheck(items);

    if( items === null || items === undefined ){
        result = null;
    }
    else if( t === 'array' ){
        result = items.map((item: any) => {
            return dataLoop(item, cb);
        });
    }
    else if( t === 'object' ){
        result = {};
        for( const key in items ){
            const item = items[key];
            result[key] = dataLoop(item, cb);
        }
    }
    else if( t === 'boolean' || t === 'number' ){
        result = items;
    }
    else {
        result = cb(t, items);
    }

    return result;
}

/**
 * 데이터 인코딩 처리
 */
function dataEncode(data: any) {
    // 데이터가 없을 경우
    if( !data ){ return {}; }

    // 데이터 반복
    return dataLoop(data, (t, item) => {
        // 문자열 인코딩
        if( t === 'string' ){
            return encodeURIComponent(item);
        }
        
        return item;
    });
}

/**
 * 데이터 디코드 처리
 */
function dataDecode(data: any) {
    // 데이터가 없을 경우
    if( !data ){ return {}; }

    // 데이터 반복
    return dataLoop(data, (t, item) => {
        // 문자열 디디코딩
        if( t === 'string' ){
            return decodeURIComponent(item);
        }
        
        return item;
    });
}