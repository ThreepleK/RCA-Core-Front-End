export * from './api-permission-set'
export * from './api-tabs-members'
export * from './api-tabs-permission'

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string;        // 에러 메시지
};