import { useEffect, useState } from "react";
import { Button, Flex } from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";

import { ContentsLayout } from "@/compos/layout";
import { gridCreateModal, gridEditModal, gridRemoveModal } from "./components/modals";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";
import { MRT_TableInstance } from "mantine-react-table";
import { api_list } from "./apis";
import { gridDeactiveModal } from "./components/modals/grid-deactive-modal";
import { BasicTheme } from "@/compos/ui/data-grid-theme/basic-theme";
import { useBasicGridEvntsStore, useBasicGridStore } from "@/compos/ui/data-grid-theme/basic-theme/basic-theme-store";
import { COLUMN_ITEM, columnFilters } from "@/compos/ui/data-grid";

import style from "./style.module.css";

export function Users(){
    const { sendEvent } = useBasicGridEvntsStore(s => s);

    //* 추가
    const onCreate = () => {
        sendEvent('create', '');
    };

    //* 액션버튼
    const onActions = (key: string) => {
        sendEvent(`selected-${key}`, '');
    };

    return (
        <ContentsLayout
            title='Users'
            titleRightSide={
                <Flex justify='flex-end' gap='xs'>
                    <DropdownMenu label='Actions' menuList={_ACTION_MENUS} onActions={onActions} />
                    <Button size="xs" radius="md"
                        leftSection={<IconPlus size={14} />}
                        onClick={onCreate}
                    >Create user</Button>
                </Flex>
            }
        >
            {/* 그리드 본문 */}
            <div className={style['cont-area']}>
                <BasicTheme />
            </div>

            {/* 그리드 이벤트 처리 */}
            <GridEvents />
        </ContentsLayout>
    );
}

/**
 * 그리드 이벤트 처리
 */
function GridEvents(){
    const [table, setTable] = useState<MRT_TableInstance<any>|null>(null);

    const { setColumns, setGridData, setIsLoading, setActionsCols } = useBasicGridStore(s => s);
    const { evKey, evData, sendEvent } = useBasicGridEvntsStore(s => s);

    //* 리스트 가져오기
    const onListLoad = async () => {
        // 그리드에 로딩 표기
        setIsLoading(true);

        // 리스트 불러와서 재설정
        const list = await api_list();
        setGridData(list as any);

        // 그리드에 로딩 숨김
        setIsLoading(false);
    }

    //* 그리드 이벤트 처리
    useEffect(() => {
        // 이벤트 데이터가 없으면 처리 안함
        if( evKey === null ){ return; }

        // 기존 이벤트 제거
        sendEvent(null, null);

        // 이벤트 처리
        switch( evKey ){
            // 그리드 준비 완료
            case 'ready': {
                setTable(evData as MRT_TableInstance<any>);
                onListLoad();
            } break;

            // 추가
            case 'create': {
                // 처리하고 다시 불러오기
                gridCreateModal(onListLoad);
            } break;

            // 수정
            case 'edit': {
                // 처리하고 다시 불러오기
                gridEditModal(evData, onListLoad);
            } break;

            // 삭제
            case 'delete': {
                // 처리하고 다시 불러오기
                gridRemoveModal([evData.id], onListLoad);
            } break;

            // 선택 삭제
            case 'selected-delete': {
                // 그리드에서 선택된 row 리스트
                const selectedRows = table.getSelectedRowModel().flatRows;

                // 삭제 할 id만 추려오기
                const rmList = selectedRows.map(r => r.original?.id);
                // 삭제 모달 출력
                gridRemoveModal(rmList, onListLoad);
            } break;

            // 선택 비활성화
            case 'selected-deactive': {
                // 그리드에서 선택된 row 리스트
                const selectedRows = table.getSelectedRowModel().flatRows;

                // 선택 항목 비활성화 처리
                const list = selectedRows.map(r => r.original);
                gridDeactiveModal(list, onListLoad);
            } break;
        }
    }, [evKey, evData]);

    //* 초기 설정
    useEffect(() => {
        // 컬럼에 적용 할 Action 버튼 추가
        setActionsCols({
            edit: <IconEdit size={20} strokeWidth={1.5} title='Edit' />,
            delete: <IconTrash size={20} strokeWidth={1.5} title='Delete' />,
        });

        // 컬럼 설정
        setColumns(_COLUMNS);
    }, [])

    return <></>;
}

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
    {key: 'deactive', label: 'Deactive member'},
    {key: 'delete', label: 'Delete member'},
];

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = (() => {
    const {text, select, dateRange} = columnFilters;

    // 기본 필터
    const basicFilter = text({});
    // Status 선택 필터
    const statusFilter = select({data: ['Active', 'InActive']});
    // 생성날짜 필터
    const createTimeFilter = dateRange({
        accessorKey: 'createTime',
        dateFormat: 'YYYY-MM-DD HH:mm'
    });
    
    // 그리드 컬럼 정보 전달
    return [
        { accessorKey: "name",       header: "Name", ...basicFilter },
        { accessorKey: "email",      header: "Email" , ...basicFilter },
        { accessorKey: "team",       header: "Team" , ...basicFilter },
        { accessorKey: "org",        header: "Organization" , ...basicFilter },
        { accessorKey: "userGroup",  header: "User group" , ...basicFilter },
        { accessorKey: "status",     header: "Status", ...statusFilter },
        { accessorKey: "createTime", header: "Create time", ...createTimeFilter },
    ]
})();