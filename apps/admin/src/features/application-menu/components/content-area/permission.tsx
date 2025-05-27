import { COLUMN_ITEM, columnFilters } from '@/compos/ui/data-grid';
import { BasicTheme, GridEventProvider, GridProvider, useGridEventStore, useGridStore } from '@/compos/ui/data-grid-theme';
import { useTreeStore } from '@/compos/ui/tree-editor';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { MRT_TableInstance } from 'mantine-react-table';
import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { api_list } from '../../apis';
import { gridEditModal, gridRemoveModal } from '../modals';

export function Permission(){
    const treeStore = useTreeStore();
    const selectedItem = useStore(treeStore, s => s.selectedItem);

    // * 선택된 메뉴가 없을 때
    if( selectedItem === null ){
        return <>Please select the menu on the left.</>;
    }

    return (
        <Grid />
    );
}

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

    //-- Grid 필터 관련
    const gobalSearch = useStore(gridStore, s => s.gobalSearch);
    const colSorting = useStore(gridStore, s => s.colSorting);
    const colFilters = useStore(gridStore, s => s.colFilters);

    //-- Grid 페이징 관련
    const pagination = useStore(gridStore, s => s.pagination);
    const setRowCount = useStore(gridStore, s => s.setRowCount);

    //-- Grid 이벤트 관련
    const evKey = useStore(eventStore, s => s.evKey);
    const evData = useStore(eventStore, s => s.evData);
    const sendEvent = useStore(eventStore, s => s.sendEvent);

    //* 리스트 가져오기
    const onListLoad = async () => {
        // 그리드에 로딩 표기
        setIsLoading(true);

        // 리스트 불러와서 재설정
        const list = await api_list({
            pagination,
            search: gobalSearch,
            filter: colFilters,
            sort: colSorting,
        });
        
        // 그리드 데이터 설정
        setGridData(list.data as any);
        // 그리드 총 갯수 설정
        setRowCount(list.meta.total);

        // 그리드에 로딩 숨김
        setIsLoading(false);
    }

    useEffect(() => {
        onListLoad();
    }, [
        colFilters,
        gobalSearch,
        pagination.pageIndex,
        pagination.pageSize,
        colSorting,
    ]);

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

    return <></>;
}

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = (() => {
    const {text, select, dateRange, multiSelect} = columnFilters;

    // 기본 필터
    const basicFilter = text({});
    // Status 선택 필터
    const statusFilter = multiSelect({data: ['Active', 'InActive']});
    // 생성날짜 필터
    const createTimeFilter = dateRange({
        accessorKey: 'createdTime',
        dateFormat: 'YYYY-MM-DD HH:mm'
    });
    
    // 그리드 컬럼 정보 전달
    return [
        { accessorKey: "fullName",      header: "Name", ...basicFilter },
        { accessorKey: "email",         header: "Email" , ...basicFilter },
        { accessorKey: "team",          header: "Team" , ...basicFilter },
        { accessorKey: "org",           header: "Organization" , ...basicFilter },
        { accessorKey: "userGroup",     header: "User group" , ...basicFilter },
        { accessorKey: "status",        header: "Status", ...statusFilter },
        { accessorKey: "createdTime",   header: "Created time", ...createTimeFilter },
    ]
})();