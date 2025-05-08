import { useMemo } from 'react';
import { Text } from '@mantine/core';
import { SortableTree } from 'dnd-kit-sortable-tree';

import { useTreeStore, TREE_LIST } from './'
import { RootCtxMenu, TreeItem } from './components'

import { CtxMenu } from '@/compos/ui/ctx-menu'
import { CtxBox } from '@/compos/ui/ctx-box'

import style from "./tree-editor.module.css";

/**
 * 트리 에디터
 */
export function TreeEditor({list}: {
    list: TREE_LIST;
}){
    const {flag, setTreeList} = useTreeStore(s => s);
    const items = useMemo(() => list, [flag]);

    return <>
        {list.length === 0
            ? <Text className={style['no-tree-data']}>Please add a menu item.</Text>
            : <div className={style.tree}>
                <SortableTree
                    items={items}
                    onItemsChanged={setTreeList}
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