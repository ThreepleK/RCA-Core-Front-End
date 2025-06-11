import type { ValidateItem } from "@/compos/grid";

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

    //* 신규 등록
    if( type === 'new' ){
        //* 아이디
        if( r.username === '' ){
            res.code = 'username';
            res.isErr = true;
            res.msg = '아이디를 입력해주세요.';

            return res;
        }
    }

    //* 이름
    if( r.fullName === '' ){
        res.code = 'fullName';
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

    return res;
}