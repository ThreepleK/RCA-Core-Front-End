import { IconFolder, IconFolderOpen, IconFile } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { Tree, Text, Group } from '@mantine/core';
import { useTree, getTreeExpandedState, RenderTreeNodePayload, TreeNodeData } from '@mantine/core';

import style from "../style.module.css";

/**
 * 사이드 영역
 */
export function TreeEditor({className, MenuList}: {
    className: string;    
    MenuList: TreeNodeData[];
}){
    const tree = useTree();
    
    // 트리 메뉴가 변경됬을 때 전체 펼침 처리
    useEffect(() => {
        tree.expandAllNodes();
    }, [MenuList]);

    return (
        <Tree
            tree={tree}
            className={className}
            selectOnClick
            clearSelectionOnOutsideClick
            data={MenuList}
            renderNode={(payload) => <Leaf {...payload} />}
        />
    );
}

/**
 * 왼쪽 아이콘
 */
function LeftIcon({ isFolder, expanded }: {
    isFolder: boolean;      // 폴더 여부
    expanded: boolean;      // 펼침 여부
}) {  
    if (isFolder) {
        return expanded
            ? <IconFolderOpen size={16} stroke={1.25} />
            : <IconFolder size={16} stroke={1.25} />
        ;
    }
  
    return <IconFile size={16} stroke={1.25} />;
}

/**
 * 아이템 요소
 */
function Leaf({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) {
    //* 메뉴 우클릭
    const onMenuClick = (e: any) => {
        // NavLink의 기본 a href가 동작하지 않기 위함
        e.preventDefault();

        console.log('메뉴 우클릭', e, node)
    }

    return (
        <div className={style['tree-item']}>
            <Group
                gap={4}
                onContextMenu={onMenuClick}
                {...elementProps}
            >
                <LeftIcon isFolder={hasChildren} expanded={expanded} />
                <Text size="sm">{node.label}</Text>
            </Group>
        </div>
    );
}