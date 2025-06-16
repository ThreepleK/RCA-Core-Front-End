import { useCommModalStore } from "@/compos/modal";
import { UI_Button, type ColDef } from "@/compos/ui";
import { GridBasic, GridConnPublic } from "@/compos/grid";
import type { GridApi } from "ag-grid-community";
import { SectionStore } from "@/stores";
import { api_tabsAddMemberList } from "@/features/user-group/apis";

import style from "./members.module.css";
import { notification } from "antd";
import { useEffect, type ReactNode } from "react";

// 모달과 컨텐츠 사이 제어 용
let _evSender: SectionStore<any> = null;

// AgGrid api 제어용
let _agGridApi: GridApi<any> = null;

/**
 * 맴버 추가
 */
export function addMemberProcess(
    addMemberCB: (rows: any[]) => void,     // 추가 할 사용자 콜백
){
    const {setContent, setOpen} = useCommModalStore.getState();

    // 맴버 추가 모달 내용 설정정
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

            // 저장이 아니거나, 아직 grid가 준비되지 않을 경우 건너 뜀
            if( key !== 'add' || !_agGridApi ){ return; }

            // 그리드에서 선택된 항목 가져오기
            const rows = _agGridApi.getSelectedRows();

            // 추가 할 대상이 없을 경우
            if( rows.length === 0 ){
                // 1개 이상 선택 안내 표기
                _evSender.trigger('err-noti', {
                    title: 'Warning',
                    msg: 'Please select one or more users.'
                });
                return;
            }

            // 추가 할 대상 전달
            addMemberCB(rows);

            // 모달 닫기
            setOpen(false);
        },
        size: 'lg'
    });

    // 모달 열기
    setOpen(true);
}

/**
 * 맴버 추가 컴포넌트
 */
function AddMember({}: {}){
    const [api, contextHolder] = notification.useNotification();

    //* 알림 표기
    const openNoti = ({title, msg}: {
        title: string | ReactNode,      // 제목
        msg: string | ReactNode,        // 내용
    }) => {
        api.warning({
            placement: 'top',
            message: title,
            description: msg,
        });
    };

    useEffect(() => {
        if( !_evSender ){
            _evSender = new SectionStore<any>();
        }

        // 에러 알림
        _evSender.on('err-noti', openNoti);

        // UnMount
        return () => {
            _evSender.destroy();
            // _evSender = null;
        }
    }, []);

    return <>
        {/* 알람 */}
        {contextHolder}

        {/* 그리드 */}
        <div className={style.grid}>
            <GridBasic
                columns={_COLUMNS}
                processCB={gridProcess}
            />
        </div>
    </>;
}

/**
 * 그리드 프로세스 처리
 */
function gridProcess(
    gridApi: GridApi<any>,
    gridConn: GridConnPublic,
){ 
    /**
     * 리스트 가져오기
     */
    const listLoad = async () => {
        // 등록된 사용자 리스트 가져오기
        const memberList = await api_tabsAddMemberList();

        // 그리드에 리스트 전달
        gridConn.setList(memberList);

        // 로딩 끝
        gridConn.setLoading(false);
    };

    // init
    (async () => {
        _agGridApi = gridApi;

        // 그리드 헤더 셀 높이 설정
        gridConn.setHeaderCellHeight(40);

        // 데이터 없을 시 메시지
        gridConn.setNoDataMsg(<>
            Please search for the users you want to assign to a group.
        </>);

        // 리스트 가져오기
        await listLoad();
    })();

    // UnMount
    return () => {
        _agGridApi = null;
    };
}

// 그리드 컬럼 설정
const _COLUMNS: ColDef[] = (() => {
    //* 그리드 컬럼 설정
    return [
        { field: 'fullName',    headerName: 'User name'},
        { field: 'email',       headerName: 'Email' },
    ];
})();