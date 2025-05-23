import { columnFilters, COLUMN_ITEM } from "@/compos/ui/data-grid";
import { useMemo } from "react";

import style from "./content-area.module.css";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { GridThemeBasic } from "@/compos/ui/data-grid-theme";
import { MRT_TableInstance } from "mantine-react-table";

/**
 * 컨텐츠 본문
 * @param data 그리드에 보여줄 데이터
 * @param isLoading 그리드 로딩 여부
 * @param onRowClick 그리드 row 선택 
 * @param onEdit 그리드 row 편집
 * @param onRemove 그리드 row 삭제
 * @param onReady 그리드 준비완료 이벤트
 */
export function ContentArea({ data, isLoading, onRowClick, onEdit, onRemove, onReady }: {
    data: any;
    isLoading?: boolean;
    onRowClick?: (row: any) => void;
    onEdit: (row: any) => void;
    onRemove: (row: any) => void;
    onReady?: (table: MRT_TableInstance<any>)=>void;
}) {
    // Action 컬럼을 추가
    const actions = useMemo(() => ({
        // 버튼
        buttons: {
            edit: <IconEdit size={20} strokeWidth={1.5} title='Edit' />,
            rm: <IconTrash size={20} strokeWidth={1.5} title='Remove' />,
        },
        // 버튼 클릭 처리
        feedback: (btnKey, row) => {
            switch( btnKey ){
                case 'edit': onEdit(row.original); break;
                case 'rm': onRemove(row.original); break;
            }
        }
    }), []);

    // 그리드 옵션 추가
    const opts = useMemo(() => ({
        enableRowSelection: true,       // 좌측 선택
        state: {
            isLoading,                  // 로딩 여부
        },

        mantineTableBodyRowProps: ({ row }) => {
            return {
                onClick: () => alert('test'),
            };
        }
    }), [isLoading]);
  
    return (
        <div className={style["cont-area"]}>
            <GridThemeBasic
                columns={_COLUMNS}
                data={data}
                actions={actions}
                rowClick={onRowClick}
                opts={opts as any}
                onReady={onReady}
            />
        </div>
    );
}

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