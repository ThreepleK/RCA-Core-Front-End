import { useState } from "react";

import { useCommModalStore } from "@/compos/modal";
import { UI_Button, UI_Input, type ColDef } from "@/compos/ui";
import { IconSearch } from "@tabler/icons-react";
import { GridBasic } from "@/compos/grid";
import type { GridApi } from "ag-grid-community";
import type { SectionStore } from "@/stores";

import style from "./members.module.css";

type ProcessCBMap = {
    /**
     * 그리드 사용자 검색
     * @param search string
     */
    'grid-userSearch': string;
}

/**
 * 맴버 추가 컴포넌트
 */
function AddMember({}: {}){
    const [inputVal, setInputVal] = useState<string>('');
    const [processConn, setProcessConn] = useState<SectionStore<ProcessCBMap>>(null);

    //* 사용자 검색
    const onSearch = () => {
        processConn.trigger('grid-userSearch', inputVal);
    }

    return <>
        <div className={style.search}>
            <UI_Input
                value={inputVal}
                onChange={(event) => setInputVal(event.currentTarget.value)}
                onKeyUp={(e) => { if(e.keyCode === 13){ onSearch(); } }}
                placeholder="User search..."
                addonAfter={
                    <IconSearch size={18} onClick={onSearch} />
                }
            />
        </div>
        <div className={style.grid}>
            <GridBasic
                columns={_COLUMNS}
                processCB={gridProcess}
                processConn={setProcessConn}
            />
        </div>
    </>;
}

/**
 * 그리드 프로세스 처리
 */
function gridProcess(
    gridApi: GridApi<any>,
    gridConn: SectionStore<any>,
    pConn: SectionStore<ProcessCBMap>
){
    // 초기 로딩 끄기
    gridConn.trigger('loading', false);

    // 그리드 헤더 셀 높이 설정
    gridConn.trigger('headerCellHeight', 40);

    // 데이터 없을 시 메시지
    gridConn.trigger('noDataMsg', <>
        Please search for the users you want to assign to a group.
    </>);

    // 사용자 검색
    pConn.on('grid-userSearch', (search: string) => {
        console.log('사용자 검색', search);

        // todo .. 사용자 검색 처리
        // 리스트 표기
    });
}

/**
 * 맴버 추가
 */
export function addMemberProcess(){
    const {setContent, setOpen} = useCommModalStore.getState();

    setContent({
        title: 'Add member',
        content: <AddMember />,
        buttons: {
            'cancel': <UI_Button>Cancel</UI_Button>,
            'add': <UI_Button type='primary'>Add</UI_Button>,
        },
        feedback: (key: string) => {
            // 닫기
            if( key === 'cencel' ){
                setOpen(false);
                return;
            }

            console.log('key', key);
        },
        size: 'lg'
    });

    setOpen(true);
}

// 그리드 컬럼 설정
const _COLUMNS: ColDef[] = (() => {
    //* 그리드 컬럼 설정
    return [
        { field: 'fullName',    headerName: 'User name',
            valueGetter: ({ data: { fullName } }) => {
                return fullName;
            }
        },
        { field: 'email',       headerName: 'Email' },
        { field: 'department',  headerName: 'Department', },
    ];
})();