import type { ValidateItem } from "..";

/**
 * 폼 데이터 검증
 * @param type 검증 타입
 * @param r 추가/수정 될 데이터 row
 */
export async function formCloneValidate(
    type: 'new' | 'mod',
    r: any
): Promise<ValidateItem> {
    const res: ValidateItem = {
        isErr: false,
        msg: '',
        code: '',
    };

    //* Permission set name
    if( r.name === '' ){
        res.code = 'name';
        res.isErr = true;
        res.msg = '이름을 입력해주세요.';

        return res;
    }

    if( r.description === '' ){
        res.code = 'description';
        res.isErr = true;
        res.msg = '설명을 입력해주세요.';

        return res;
    }

    return res;
}