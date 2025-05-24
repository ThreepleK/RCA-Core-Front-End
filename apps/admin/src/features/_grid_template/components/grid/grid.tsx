import { useEffect, useRef } from "react";
import { useStore } from "zustand";
import { MRT_TableInstance } from "mantine-react-table";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { COLUMN_ITEM, columnFilters } from "@/compos/ui/data-grid";
import { BasicTheme, GridEventProvider, GridProvider, useGridEventStore, useGridStore } from "@/compos/ui/data-grid-theme";
import { useSendAction } from "../../stores";
import { api_list } from "../../apis";
import { gridCreateModal, gridEditModal, gridRemoveModal, gridDeactiveModal } from "../modals";

/**
 * UI에 적용할 그리드
 */
export function Grid(){
    return (
        <GridProvider>              {/* 그리드 기본 설정 Store를 위한 Context */}
            <GridEventProvider>     {/* 그리드 이벤트 처리 Store를 위한 Context */}
                <GridSet />         {/* 그리드 기본 세팅 */}
            </GridEventProvider>
        </GridProvider>
    );
}

/**
 * 그리드 기본 설정 값
 */
function GridSet(){
    return <>
        {/* 그리드 본문 */}
        <BasicTheme />

        {/* 그리드 초기 설정 */}
        <GridInit />

        {/* 그리드 이벤트 처리 */}
        <GridEvents />
    </>;
}

/**
 * 그리드 초기 설정
 */
function GridInit(){
    const gridStore = useGridStore();

    //-- Grid 상태 관련
    const setColumns = useStore(gridStore, s => s.setColumns);
    const setActionsCols = useStore(gridStore, s => s.setActionsCols);

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

/**
 * 그리드 이벤트 처리
 */
function GridEvents(){
    const gridStore = useGridStore();
    const eventStore = useGridEventStore();

    //-- Grid 제어용
    const tableRef = useRef<MRT_TableInstance<any>>(null);

    //-- Grid 상태 관련
    const setGridData = useStore(gridStore, s => s.setGridData);
    const setIsLoading = useStore(gridStore, s => s.setIsLoading);

    //-- Grid 이벤트 관련
    const evKey = useStore(eventStore, s => s.evKey);
    const evData = useStore(eventStore, s => s.evData);
    const sendEvent = useStore(eventStore, s => s.sendEvent);

    // -- UI Action 버튼 이벤트 관련
    const acKey = useSendAction(s => s.evKey);
    const acSend = useSendAction(s => s.sendEvent);

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
                tableRef.current = evData as MRT_TableInstance<any>;
                onListLoad();
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
        }
    }, [evKey, evData]);

    //* UI 버튼 이벤트
    useEffect(() => {
        if( acKey === null ){ return; }
        acSend(null);

        // 이벤트 처리
        switch( acKey ){
            // 추가
            case 'create': {
                // 처리하고 다시 불러오기
                gridCreateModal(onListLoad);
            } break;

            // 선택 삭제
            case 'selected-delete': {
                const table = tableRef.current;

                // 그리드에서 선택된 row 리스트
                const selectedRows = table.getSelectedRowModel().flatRows;

                // 삭제 할 id만 추려오기
                const rmList = selectedRows.map(r => r.original?.id);
                // 삭제 모달 출력
                gridRemoveModal(rmList, onListLoad);
            } break;

            // 선택 비활성화
            case 'selected-deactive': {
                const table = tableRef.current;                
                // 그리드에서 선택된 row 리스트
                const selectedRows = table.getSelectedRowModel().flatRows;

                // 선택 항목 비활성화 처리
                const list = selectedRows.map(r => r.original);
                gridDeactiveModal(list, onListLoad);
            } break;
        }
    }, [acKey])

    return <></>;
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