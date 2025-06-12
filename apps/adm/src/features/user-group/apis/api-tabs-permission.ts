import { request } from '@/utils'
import { api_updateItem } from './api-comm';

/**
 * [Edit > Tabs > Permission Set]
 * 리스트 가져오기
 */
export async function api_tabsPermissionList(): Promise<any[]>{

    const res = await request({
        type: 'get',
        url: '/admin/api/permission-sets'
    });

    if( res.isErr ){
        return [];
    } else {
        return (res as any).res;
    }
}

/**
 * [Edit > Tabs > Permission Set]
 * 저장
 */
export async function api_tabsPermissionSave(
    permissionIds: string[],
    row: any
): Promise<any>{

    // 저장 데이터 설정
    const saveData = {
        id: row.id,
        name: row.name,
        description: row.description,
        status: row.status,
        userIds: !row.users ? [] : row.users.map(r => r.id),
        permissionSetIds: permissionIds,
    }

    return api_updateItem(saveData);
}

