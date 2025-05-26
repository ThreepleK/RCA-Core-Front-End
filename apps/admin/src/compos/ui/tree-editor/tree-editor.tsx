import { ReactNode, useMemo } from 'react';
import { Box, Divider, Text } from '@mantine/core';
import { SortableTree } from 'dnd-kit-sortable-tree';

import { TREE_LIST, TREE_ITEM } from './'
import { RootCtxMenu, TreeItem } from './components'

import { CtxMenu } from '@/compos/ui/ctx-menu'
import { CtxBox } from '@/compos/ui/ctx-box'

import style from "./tree-editor.module.css";
import { IconCloudNetwork, IconMenu4 } from '@tabler/icons-react';
import { useStore } from 'zustand';
import { useTreeStore } from './tree-editor-store-ctx';

/**
 * 트리 에디터
 * @param opts
 * @param opts.isShowRootLabel 루트 라벨 보임 여부
 * @param opts.divderLabel 구분선 라벨 명
 */
export function TreeEditor({ isShowRootLabel=true, divderLabel='' }: {
    isShowRootLabel?: boolean;
    divderLabel?: string|ReactNode;
}){
    const treeStore = useTreeStore();
    const {flag, rootItem, list, setTreeChildList} = useStore(treeStore, s => s);
    const items = useMemo(() => list, [list, flag]);

    // 선택된 데이터가 없을 경우
    if( !rootItem ){ return <>No Tree Data</> }

    return <>
        {/* 메인 최상위 메뉴 */}
        <RootItem />

        {/* 구분 선 */}
        {divderLabel &&
            <Divider variant='dashed' label={divderLabel} />
        }

        {/* 트리 메뉴 */}
        {items.length === 0
            ? <Text className={style['no-tree-data']}>Please add a menu item.</Text>
            : <div className={style.tree}>
                <SortableTree
                    items={items}
                    onItemsChanged={setTreeChildList}
                    TreeItemComponent={TreeItem}
                />
            </div>
        }

        {/* 우클릭 Root 메뉴 */}
        <RootCtxMenu />
        {/* 우클릭 메뉴 */}
        <CtxMenu />
        {/* 우클릭 기타 박스 */}
        <CtxBox />
    </>;
}

/**
 * 루트 아이템
 */
function RootItem(){
    const treeStore = useTreeStore();
    const {flag, rootItem, setSelectedItem} = useStore(treeStore, s => s);
    const root = useMemo(() => rootItem, [rootItem, flag]);

    //* 아이템 선택 여부
    const selected = useMemo(() => root.selected, [root.selected]);

    // 하위 항목 변경 건
    const onRootItemClick = () => {
        setSelectedItem( String(root.id) );
    };

    return (
        <div className={`${style['root-item']} ${selected ? 'on-active': ''}`} onClick={onRootItemClick}>
            <IconCloudNetwork size={16} stroke={1.25} />
            <Text size='sm'>{root.label}</Text>
        </div>
    )
}