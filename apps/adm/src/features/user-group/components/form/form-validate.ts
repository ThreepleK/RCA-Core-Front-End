// import { api_chkDupleEmail, api_chkDupleID, ApiResult } from "../../apis";

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

    //* 그룹명
    if( r.groupName === '' ){
        res.code = 'groupName';
        res.isErr = true;
        res.msg = '그룹명을 입력해주세요.';

        return res;
    }

    //* 설명
    if( r.description === '' ){
        res.code = 'description';
        res.isErr = true;
        res.msg = '설명을 입력해주세요.';

        return res;
    }


    return res;
}