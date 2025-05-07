import { IconFolder, IconFolderOpen, IconFile, IconTrash, IconPlus } from '@tabler/icons-react';
import { useEffect, useState, forwardRef, useMemo } from 'react';
import { Text, Menu } from '@mantine/core';
import { SimpleTreeItemWrapper, SortableTree, TreeItemComponentProps, TreeItems } from 'dnd-kit-sortable-tree';

import { useCtxMenuStore, CtxMenuItem } from '../stores'

import style from "../style.module.css";

/**
 * 사이드 영역
 */
export function TreeEditor({className, selectedLabel, menuList}: {
    className: string;  
    selectedLabel: string;  
    menuList: TREE_LIST;
}){
    const [items, setItems] = useState(menuList);

    useEffect(() => {
        setItems(menuList);
    }, [selectedLabel])

    return <>
        {menuList.length === 0
            ? <Text className={style['no-tree-data']}>Please add a menu item.</Text>
            : <div className={className}>
                <SortableTree
                    items={items}
                    onItemsChanged={setItems}
                    TreeItemComponent={TreeItem}
                />
            </div>
        }
    </>;
}

/**
 * 트리 아이템
 */
const TreeItem = forwardRef<
    HTMLDivElement,
    TreeItemComponentProps<TREE_ITEM>
>((props, ref) => {
    const {setOpen, setPosition, setMenuList} = useCtxMenuStore(s => s);

    //* 아이템 폴더(접힘 여부), 추가 스타일 적용 값 가져오기
    const {isFolder, collapsed, addStyle} = useMemo(() => {
        const res = {
            isFolder: false,        // 폴더 여부
            collapsed: false,       // 접힘 여부
            addStyle: {}            // 추가 강제 style 적용 값
        };

        // DnD 상태 (본인 포함 childCount)
        if( props?.clone ){
            res.isFolder = (props.childCount ?? 1) > 1;
            res.collapsed = true;
            res.addStyle = {
                display: 'flex',
                alignItems: 'center',
                columnGap: 'calc(var(--spacing) * 0.5);',
            };
        }
        // Tree 아이템 상태 (본인 제외 childCount)
        else {
            res.isFolder = (props.childCount ?? 0) > 0;
            res.collapsed = (props.collapsed ?? false);
        }

        return res;
    }, [props?.clone, props.childCount, props.collapsed]);

    //* 마우스 우클릭 이벤트
    const onMenuClick = (e: any) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        // 우클릭 메뉴 설정
        const menu: CtxMenuItem[] = [
            {type: 'label', label: props.item.label, value: ''},
            {type: 'item', label: 'Add submenu', value: 'item-add', icon: <IconPlus size={16} />},
            {type: 'item', label: 'Remove', value: 'item-remove', icon: <IconTrash size={16} /> },
        ];

        // 메뉴 설정 및 선택 이벤트 처리
        setMenuList(menu, (selected) => {
            switch( selected ){
                case 'item-add': break;
                case 'item-remove': break;
            }
            console.log('메뉴 선택', selected);
            console.log(props);
        });

        setPosition(clientX, clientY);
        setOpen(true);
    }

    return (
        <div key={props.item.id} onContextMenu={onMenuClick}>
            <SimpleTreeItemWrapper className={style['tree-item']} {...props} ref={ref}>
                <div className={style['tree-item-in']} style={addStyle}>
                    <LeftIcon isFolder={isFolder} collapsed={collapsed} />
                    {props.item.label}
                </div>
            </SimpleTreeItemWrapper>
        </div>
    );
});

/**
 * 왼쪽 아이콘
 */
function LeftIcon({ isFolder, collapsed }: {
    isFolder: boolean;      // 폴더 여부
    collapsed: boolean;     // 접힘 여부
}) {  
    if (isFolder) {
        return collapsed
            ? <IconFolder size={16} stroke={1.25} />        // 폴더 접힘
            : <IconFolderOpen size={16} stroke={1.25} />    // 폴더 펼침
        ;
    }
  
    return <IconFile size={16} stroke={1.25} />;            // 파일
}

//* 트리 아이템 추가 타입
type TREE_ITEM = {
    label: string;                      // 메뉴 명
    nodeProps?: {                       // ---- DB 데이터 값 ----
        level: number;                  // 메뉴 Depth
        sortOrder: number;              // 메뉴 Depth 별 순서
        id: string;                     // 메뉴 ID
        parentMenuId: string|null,      // 부모 메뉴 ID
        name: string;                   // 메뉴 명
        displayName: string;            // 화면에 보일 메뉴명
        url: string;                    // 이동 경로
        openNewTab: boolean;            // 신규 탭 열림 여부
        isVisible: boolean;             // 메뉴 보임 여부
    };
};

//* 트리 데이터 타입 설정
export type TREE_LIST = TreeItems<TREE_ITEM>;