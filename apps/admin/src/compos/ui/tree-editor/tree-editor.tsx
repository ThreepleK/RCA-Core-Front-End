import { ReactNode, useMemo } from 'react';
import { useStore } from 'zustand';
import { Divider, Text } from '@mantine/core';
import { IconCloudNetwork } from '@tabler/icons-react';
import { SortableTree } from 'dnd-kit-sortable-tree';

import { CtxMenu } from '@/compos/ui/ctx-menu'
import { CtxBox } from '@/compos/ui/ctx-box'
import { RootCtxMenu, TreeItem } from './components'
import { useTreeStore } from './';

import style from "./tree-editor.module.css";

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

    const flag = useStore(treeStore, s => s.flag);
    const rootItem = useStore(treeStore, s => s.rootItem);
    const list = useStore(treeStore, s => s.list);
    const setTreeChildList = useStore(treeStore, s => s.setTreeChildList);

    const items = useMemo(() => list, [list, flag]);

    // 선택된 데이터가 없을 경우
    if( !rootItem ){
        return <Text className={style['no-tree-data']}>No Tree Data</Text>;
    }

    return <>
        {/* 메인 최상위 메뉴 */}
        {isShowRootLabel && <RootItem />}

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
    const flag = useStore(treeStore, s => s.flag);
    const rootItem = useStore(treeStore, s => s.rootItem);
    const setSelectedItem = useStore(treeStore, s => s.setSelectedItem);
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