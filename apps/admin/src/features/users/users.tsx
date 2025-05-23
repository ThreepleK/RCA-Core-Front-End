import { useState } from "react";
import { Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { ContentsLayout } from "@/compos/layout";
import { ContentArea } from "./components/content-area/content-area";
import { gridCreateModal, gridEditModal, gridRemoveModal } from "./components/modals";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";
import { MRT_TableInstance } from "mantine-react-table";
import { api_list } from "./apis";
import { gridDeactiveModal } from "./components/modals/grid-deactive-modal";

// import style from "./style.module.css";

export function Users(){
    const [table, setTable] = useState<MRT_TableInstance<any>|null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    //* 리스트 가져오기
    const onListLoad = async () => {
        // 그리드에 로딩 표기
        setIsLoading(true);

        // 리스트 불러와서 재설정
        const list = await api_list();
        setData(list as any);

        // 그리드에 로딩 숨김
        setIsLoading(false);
    }

    //* 추가
    const onCreate = () => {
        // 추가 처리하고 다시 불러오기
        gridCreateModal(onListLoad);
    };
    
    //* 수정
    const onEdit = (row: any) => {
        // 수정 처리하고 다시 불러오기
        gridEditModal([row.id], onListLoad);
    };

    //* 삭제
    const onRemove = (row: any) => {
        // 삭제 처리하고 다시 불러오기
        gridRemoveModal([row], onListLoad);
    };

    //* 액션버튼
    const onActions = (key: string) => {
        // 그리드에서 선택된 row 리스트
        const selectedRows = table.getSelectedRowModel().flatRows;

        switch( key ){
            //* 삭제
            case 'remove': {
                // 삭제 할 id만 추려오기
                const rmList = selectedRows.map(r => r.original?.id);
                // 삭제 모달 출력
                gridRemoveModal(rmList, onListLoad);
            } break;

            //* 비활성화
            case 'deactive': {
                const list = selectedRows.map(r => r.original);
                gridDeactiveModal(list, onListLoad);
            }
        }

        console.log('key', key);
        console.log('selectedRows', selectedRows);
    };
    
    //* 그리드 준비완료
    const onReady = (table: MRT_TableInstance<any>) => {
        setTable(table);
        onListLoad();
    }

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
            <ContentArea
                data={data}
                isLoading={isLoading}
                onRowClick={onEdit}
                onEdit={onEdit}
                onRemove={onRemove}
                onReady={onReady}
            />
        </ContentsLayout>
    );
}

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
    {key: 'deactive', label: 'Deactive member'},
    {key: 'remove', label: 'Remove member'},
];