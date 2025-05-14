import { useEffect, useMemo, useRef, useState } from 'react';
import { Select, Button, Text } from '@mantine/core';
import { TreeEditor, useTreeStore, useRootCtxMenuStore } from '@/compos/ui/tree-editor'
import { DB_MENU_ITEM, getSelected_treeList, getAppList, dbRaw2Data, data2DbRaw, getDeepCp } from './utils'

import style from './menu-editor.module.css';
import { ConfirmModal, useConfirmModalStore } from '@/compos/ui/modal';

export function MenuEditor({ menu, onMenuChange }: {
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

    //* 트리 리스트
    const {rootItem, list, setTreeList, isItemUpdate, setIsUpdate} = useTreeStore(s => s);

    //* 트리 root Context 메뉴
    const rootMenuOpen = useRootCtxMenuStore(s => s.open);

    //* 앱 변경
    useEffect(() => {
        // 트리 목록 업데이트
        setTreeList( getDeepCp(treeData.allList) );
    }, [treeData.label]);

    // 컨텐츠 등에서 아이템 업데이트 요청
    useEffect(() => {
        if( !isItemUpdate ){ return; }

        // 트리 목록 → raw 데이터로 가져오기
        const applyData = data2DbRaw(list, rootItem);
        // 변경 메뉴 전달
        onMenuChange(applyData);
        // 업데이트 신호 취소
        setIsUpdate(false);
    }, [isItemUpdate]);

    //* 마우스 우클릭 이벤트
    const onMenuClick = (e: any) => {
        // 하위 이벤트 대상일 때는 건너 뜀
        if( e.target !== menuEditRef.current){ return; }
        e.preventDefault();

        // 출력 될 좌표 값 가져오기 
        const { clientX, clientY } = e;

        // 트리 root 메뉴 열기
        rootMenuOpen(clientX, clientY, treeData.label);
    }

    return (
        <div
            className={style['menu-editor']}
            ref={menuEditRef}
            onContextMenu={onMenuClick}
        >
            {/* 확인 모달 */}
            <ConfirmModal />

            {/* 앱 선택 */}
            <Select
                size="xs"
                label="Select an Application"
                data={appList}
                value={selectApp}
                onChange={setSelectApp}
                checkIconPosition="right"
                searchable
            />

            {/* 트리 편집 */}
            <TreeEditor rootItem={rootItem} list={list} />

            {/* 하단 버튼 */}
            <BottomArea treeData={treeData.label} onMenuChange={onMenuChange} />
        </div>
    );
}

/**
 * 하단 버튼 처리
 */
function BottomArea({ treeData, onMenuChange }: {
    treeData: any;
    onMenuChange: (changeMenu: DB_MENU_ITEM[]) => void;
}) {
    //* 트리 리스트
    const {rootItem, list, setTreeList} = useTreeStore(s => s);

    //* 취소
    const onCancel = () => {
        CancelModal(treeData.label, () => {
            // 트리 목록 초기화
            setTreeList( getDeepCp(treeData.allList) );
        });
    }

    //* 저장
    const onApply = () => {
        // 확인 모달
        ApplyModal(treeData.label, () => {
            // 트리 목록 → raw 데이터로 가져오기
            const applyData = data2DbRaw(list, rootItem);
            // 변경 메뉴 전달
            onMenuChange(applyData);
        });
    }

    return (
        <div className={style['me-bottom']}>
            <Button size='xs' variant='default' onClick={onCancel}>Cancel</Button>
            <Button size='xs' color='indigo' onClick={onApply}>Apply</Button>
        </div>
    )
}

/**
 * [모달] 취소
 */
function CancelModal(
    label: string,          // 관련 라벨
    callback: ()=>void      // 취소 콜백
){
    //* 모달
    const { setOpen, setContent } = useConfirmModalStore.getState();

    // 취소 모달
    setContent(
        <Text size='md' fw={500} c='red'>Cancel menu edit</Text>,
        <Text size='sm'>
            Do you want to cancel the <b>{label}</b> menu you are editing?
        </Text>
    , 'Cancel', callback);
    setOpen(true);
}

/**
 * [모달] 확인
 */
function ApplyModal(
    label: string,          // 관련 라벨
    callback: ()=>void      // 확인 콜백
){
    //* 모달
    const { setOpen, setContent } = useConfirmModalStore.getState();

    // 취소 모달
    setContent(
        <Text size='md' fw={500} c='blue'>Apply menu edit</Text>,
        <Text size='sm'>
            Would you like to save the '<b>{label}</b>' menu with the above edited content?
        </Text>
    , 'Apply', callback);
    setOpen(true);
}