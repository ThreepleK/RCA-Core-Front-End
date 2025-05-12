import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Select, Button, Modal, Text } from '@mantine/core';
import { TreeEditor, useTreeStore, useRootCtxMenuStore } from '@/compos/ui/tree-editor'
import { DB_MENU_ITEM, getSelected_treeList, getAppList, dbRaw2Data, data2DbRaw, getDeepCp } from './utils'

import style from './menu-editor.module.css';
import { ConfirmModal, useConfirmModalStore } from '@/compos/ui/modal';

export function MenuEditor({ menu, onMenuChange }: {
    menu: DB_MENU_ITEM[]
    onMenuChange: (changeMenu: DB_MENU_ITEM[]) => void;
}){
    const menuEditRef = useRef<HTMLDivElement>(null);

    //* 모달
    const { setOpen: modalOepn, setContent: modalCont } = useConfirmModalStore(s => s);

    // 메뉴, 앱 메뉴에 필요한 형태로 변환
    const menuList = useMemo(() => dbRaw2Data(menu), [menu]);
    const appList = useMemo(() => getAppList(menuList), [menuList]);

    // 기본 선택 앱 설정
    const [selectApp, setSelectApp] = useState<string|null>(appList && appList.length > 0 ? appList[0].value : '');

    //* App이 선택 되면 트리 메뉴 변경
    const treeData = useMemo(() => getSelected_treeList(menuList, selectApp), [selectApp]);

    //* 트리 리스트
    const {list, setTreeList, isItemUpdate, setIsUpdate} = useTreeStore(s => s);

    //* 트리 root 메뉴
    const rootMenuOpen = useRootCtxMenuStore(s => s.open);

    //* 앱 변경
    useEffect(() => {
        // 트리 목록 업데이트
        setTreeList( getDeepCp(treeData.list) );
    }, [treeData.label]);

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

    //* 취소
    const onCancel = () => {
        // 확인 모달
        modalCont(<Text size='md' fw={500} c='red'>Cancel menu edit</Text>,
            <Text size='sm'>
                Do you want to cancel the <b>{treeData.label}</b> menu you are editing?
            </Text>
        , 'Cancel', () => {
            // 트리 목록 초기화
            setTreeList( getDeepCp(treeData.list) );
        });
        modalOepn(true);
    }

    //* 저장
    const onApply = () => {
        // 확인 모달
        modalCont(<Text size='md' fw={500} c='blue'>Apply menu edit</Text>,
            <Text size='sm'>
                Would you like to save the '<b>{treeData.label}</b>' menu with the above edited content?
            </Text>
        , 'Apply', () => {
            // 트리 목록 → raw 데이터로 가져오기
            const applyData = data2DbRaw(list, treeData.rootItem);
            // 변경 메뉴 전달
            onMenuChange(applyData);
        });
        modalOepn(true);
    }

    // 컨텐츠 등에서 아이템 업데이트 요청
    useEffect(() => {
        if( !isItemUpdate ){ return; }

        // 트리 목록 → raw 데이터로 가져오기
        const applyData = data2DbRaw(list, treeData.rootItem);
        // 변경 메뉴 전달
        onMenuChange(applyData);
        // 업데이트 신호 취소
        setIsUpdate(false);
    }, [isItemUpdate])

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
            <TreeEditor list={list} />

            {/* 하단 버튼 */}
            <div className={style['me-bottom']}>
                <Button size='xs' variant='default' onClick={onCancel}>Cancel</Button>
                <Button size='xs' color='indigo' onClick={onApply}>Apply</Button>
            </div>
        </div>
    );
}