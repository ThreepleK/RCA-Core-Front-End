import { request } from '@/utils'
import { api_updateItem } from './api-comm';

/**
 * [Edit > Tabs > Members > add]
 * 리스트 가져오기
 */
export async function api_tabsAddMemberList(): Promise<any[]>{

    const res = await request({
        type: 'get',
        url: '/admin/api/users'
    });

    if( res.isErr ){
        return [];
    } else {
        return (res as any).res;
    }
}

/**
 * [Edit > Tabs > Members]
 * 저장
 */
export async function api_tabsMemberSave(
    membersIds: string[],
    row: any
): Promise<any>{

    // 저장 데이터 설정
    const saveData = {
        id: row.id,
        name: row.name,
        description: row.description,
        status: row.status,
        userIds: membersIds,
        permissionSetIds: !row.permissionSets ? [] : row.permissionSets.map(r => r.id),
    }

    return api_updateItem(saveData);
}