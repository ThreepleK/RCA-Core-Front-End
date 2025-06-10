import { request } from '@/utils'
import type { IFetchSidebarMenu, IFetchSidebarMenuItem } from './models';

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string;        // 에러 메시지
};


/**
 * sidebar 메뉴 가져오기
 */
export function api_getSidebarMenuData(){
    return request({
        type: 'get',
        url: '/admin/api/menu/sidebar'
    });
}

/**
 * sidebar 메뉴 저장하기
 */
export function api_setSidebarMenuData(data: IFetchSidebarMenu[]){
    return request({
        type: 'post',
        url: '/admin/api/menu/sidebar',
        datas: data
    });
}

/**
 * 이메일 중복 확인
 * @param email 이메일 주소
 * @param id 사용자 고유 아이디
 */
export function api_chkDupleEmail(email: string, id?: string){
    // return request({
    //     type: 'post',
    //     url: '/admin/api/*',
    //     datas: {email}
    // });

    // (임시 로컬 개발 테스트 용) 
    return new Promise((resolve) => {

        // 중복 이메일 체크
        // const isDuple = ((chkEmail: string) => {
        //     for( const item of _TMP_DATA ){
        //         // 다른 사용자의 이메일 주소와 같은지 확인
        //         if( item.email === chkEmail && (item?.id && item.id !== id) ){
        //             return true;
        //         }
        //     }
        //     return false;
        // })(email);

        // 딜레이 이후 결과 값 전달
        // setTimeout(() => {
        //     resolve({
        //         isErr: isDuple,
        //         msg: isDuple ? '중복된 이메일주소 입니다.' : '',
        //         res: null,
        //     });
        // }, 1000);
    
    });
}