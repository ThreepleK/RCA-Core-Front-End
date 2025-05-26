import { TextInput, List, Button, Box, Divider } from '@mantine/core';
import style from './side-area.module.css'
import { IconHierarchy2, IconLocation, IconPointFilled, IconSearch } from '@tabler/icons-react';
import { TREE_LIST, TreeEditor, useRootCtxMenuStore, useTreeStore } from '@/compos/ui/tree-editor';
import { data2DbRaw, DB_MENU_ITEM, dbRaw2Data, getAppList, getDeepCp, getSelected_treeList } from '@/features/application-menu/components';
import { useStore } from 'zustand';
import { useEffect, useMemo, useRef, useState } from 'react';

export function SideArea({menu, onMenuChange}: {
    menu: DB_MENU_ITEM[]
    onMenuChange: (changeMenu: DB_MENU_ITEM[]) => void;
}){
    const menuEditRef = useRef<HTMLDivElement>(null);

    // 메뉴, 앱 메뉴에 필요한 형태로 변환
    const menuList = useMemo(() => dbRaw2Data(menu), [menu]);
    const appList = useMemo(() => getAppList(menuList), [menuList]);

    // 기본 선택 앱 설정
    const [selectApp, setSelectApp] = useState<string|null>(appList && appList.length > 0 ? appList[0].value : '');

    //* App이 선택 되면 트리 메뉴 변경
    const treeData = useMemo(() => getSelected_treeList(menuList, selectApp), [selectApp]);

    //* 마우스 우클릭 이벤트
    const onMenuClick = (e: any) => {
        // 하위 이벤트 대상일 때는 건너 뜀
        if( e.target !== menuEditRef.current){ return; }
        e.preventDefault();

        // 출력 될 좌표 값 가져오기 
        const { clientX, clientY } = e;

        // 트리 root Context 메뉴 열기 함수 가져오기
        const rootMenuOpen = useRootCtxMenuStore.getState().open;

        // 트리 root 메뉴 열기
        rootMenuOpen(clientX, clientY, treeData.label);
    }

    return (
        <div
            className={style['side-area']}
            ref={menuEditRef}
            onContextMenu={onMenuClick}
        >
            {/* 검색 */}
            <TextInput
                size='xs'
                mb='xs'
                rightSection={<IconSearch size={16} strokeWidth={1.25} />}
            />

            {/* 트리 편집 Process */}
            <TreeEditorProcess
                rootLabel={treeData.label}
                treeList={treeData.allList}
                onMenuChange={onMenuChange}
            />
            
            <TreeEditor
                isShowRootLabel={false}
                divderLabel={<>
                    <IconHierarchy2 size={12} strokeWidth={1} />
                    <Box ml={5}>Organization</Box>
                </>}
            />

            {/* 기타 메뉴 */}
            <EtcList />

            {/* 하단 버튼 영역 */}
            <BottomArea />
        </div>
    );
}

/**
 * 트리 편집 관련 프로세스
 */
function TreeEditorProcess({rootLabel, treeList, onMenuChange}: {
    rootLabel: string;
    treeList: TREE_LIST;
    onMenuChange: (changeMenu: DB_MENU_ITEM[]) => void;
}){
    const treeStore = useTreeStore();
    //* 트리 리스트
    const {rootItem, list, setTreeList, isItemUpdate, setIsUpdate} = useStore(treeStore, s => s);

    //* 앱 변경
    useEffect(() => {
        // 트리 목록 업데이트
        setTreeList( getDeepCp(treeList) );
    }, [rootLabel]);

    //* 컨텐츠 등에서 아이템 업데이트 요청
    useEffect(() => {
        if( !isItemUpdate ){ return; }

        // 트리 목록 → raw 데이터로 가져오기
        const applyData = data2DbRaw(list, rootItem);
        // 변경 메뉴 전달
        onMenuChange(applyData);
        // 업데이트 신호 취소
        setIsUpdate(false);
    }, [isItemUpdate]);

    return <></>;
}

/**
 * 기타 메뉴
 */
function EtcList() {
    return (<>
        <Divider variant='dashed' mt='xs' label={<>
            <IconLocation size={12} strokeWidth={1} />&nbsp;
            Non Organization
        </>} />

        <List
            className={style['etc-list']}
            size='sm'
            icon={<IconPointFilled size={12}/>}
        >
            <List.Item>Unassigned (0)</List.Item>
            <List.Item>Inavitve users (0)</List.Item>
            <List.Item>Disabled (0)</List.Item>
        </List>
    </>);
}

/**
 * 하단 버튼
 */
function BottomArea(){
    const onCreate = () => {
        console.log('Create Team');
    }

    return (
        <div className={style['sa-bottom']}>
            <Button size='xs' color='indigo' onClick={onCreate}>Create Team</Button>
        </div>
    );
}