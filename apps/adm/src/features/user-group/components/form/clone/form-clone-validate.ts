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

    //* 그룹명
    if( r.name === '' ){
        res.code = 'name';
        res.isErr = true;
        res.msg = '복제 할 그룹명을 입력해주세요.';

        return res;
    }

    return res;
}