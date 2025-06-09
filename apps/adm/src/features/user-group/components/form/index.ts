export * from './form-create-content'
export * from './form-validate'
export * from './clone'

export type ValidateItem = {
    isErr: boolean;     // 에러 여부
    msg: string;        // 관련 메시지
    code: string;       // 관련 코드드
};