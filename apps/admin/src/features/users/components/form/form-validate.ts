import { api_chkDupleEmail, ApiResult } from "../../apis";

type ValidateItem = {
    isErr: boolean;     // 에러 여부
    msg: string;        // 관련 메시지
    code: string;       // 관련 코드드
};

/**
 * 폼 데이터 검증
 * @param type 검증 타입 (new: 신규, mod: 수정)
 * @param r 추가/수정 될 데이터 row
 */
export async function formValidate(
    type: 'new' | 'mod',
    r: any
): Promise<ValidateItem> {
    const res: ValidateItem = {
        isErr: false,
        msg: '',
        code: '',
    };

    // console.log('r', r);

    //* 이름
    if( r.name === '' ){
        res.code = 'name';
        res.isErr = true;
        res.msg = '이름을 입력해주세요.';

        return res;
    }

    //* 이메일 주소 확인
    if ( !/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gi.test(r.email) ){
        res.code = 'email';
        res.isErr = true;
        res.msg = '이메일 주소를 확인해주세요.';

        return res;
    }
    //* 이메일 중복 확인
    else {
        const {isErr, msg} = await api_chkDupleEmail(
            r.email, r?.id
        ) as ApiResult;

        res.code = 'email';
        res.isErr = isErr;
        res.msg = msg;

        return res;
    }

    return res;
}