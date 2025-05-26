import { SimpleTreeItemWrapper, TreeItemComponentProps } from 'dnd-kit-sortable-tree';
import { forwardRef, useMemo } from 'react';

import { useCtxMenuStore, CtxMenuItem, CtxMenuState } from '@/compos/ui/ctx-menu'
import { useCtxBoxStore, CtxBoxState } from '@/compos/ui/ctx-box'

import { RmConfirmBox, EditBox, TreeItemIcon } from './'
import { TREE_ITEM, TREE_ITEM_TYPE } from '../'

import style from "../tree-editor.module.css";
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTreeStore } from '../tree-editor-store-ctx';
import { useStore } from 'zustand';

/**
 * 트리 아이템
 */
export const TreeItem = forwardRef<
    HTMLDivElement,
    TreeItemComponentProps<TREE_ITEM_TYPE>
>((props, ref) => {
    const treeStore = useTreeStore();

    const { setOpen: setMenuOpen, setPosition: setMenuPt, setMenuList } = useCtxMenuStore(s => s);
    const { setOpen, setPosition, setContent } = useCtxBoxStore(s => s);
    const { setSelectedItem } = useStore(treeStore, s => s);

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
                columnGap: '3px',
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

        // 우클릭 메뉴 제어 처리
        onCtxMenu(
            clientX, clientY, props.item,
            setPosition, setOpen, setContent,
            setMenuList
        );

        // 메뉴 열기
        setMenuPt(clientX, clientY);
        setMenuOpen(true);
    }

    //* 마우스 클릭
    const onClick = () => {
        // 아이템 선택 처리
        const targetId = String(props.item.id);
        setSelectedItem(targetId);
    }

    //* 아이템 선택 여부
    const selected = useMemo(() => props.item.selected, [props.item.selected])

    return (
        <div key={props.item.id} onClick={onClick} onContextMenu={onMenuClick}>
            <SimpleTreeItemWrapper className={`${style['tree-item']} ${selected ? 'on-active': ''}`} {...props} ref={ref}>
                <div className={style['tree-item-in']} style={addStyle}>
                    <TreeItemIcon isFolder={isFolder} collapsed={collapsed} />
                    {props.item.label}
                </div>
            </SimpleTreeItemWrapper>
        </div>
    );
});

/**
 * 우클릭 메뉴 설정
 */
function onCtxMenu(
    clientX: number,            // 표기될 x좌표 
    clientY: number,            // 표기될 y좌표
    item: TREE_ITEM,            // 트리 아이템
    setBoxPosition: CtxBoxState['setPosition'], // 박스 위치 설정
    setBoxOpen: CtxBoxState['setOpen'],         // 박스 오픈 여부
    setBoxContent: CtxBoxState['setContent'],   // 박스 컨텐츠
    setMenuList: CtxMenuState['setMenuList'],   // 메뉴 리스트 설정
){
    // 우클릭 메뉴 가져오기
    const menu = getCtxMenu(item.label);

    // box 오픈 함수 설정
    const boxOpen = (content: any) => {
        setBoxContent(content);
        setBoxPosition(clientX, clientY);
        setBoxOpen(true);
    };

    // 메뉴 설정 및 선택 이벤트 처리
    setMenuList(menu, (selected) => {
        switch( selected ){
            // 하위 메뉴 추가
            case 'item-add':
                boxOpen(<EditBox title='Add submenu' mode='add' item={item} />);
            break;
            // 메뉴 이름 수정
            case 'item-mod':
                boxOpen(<EditBox title='Modify menu' mode='mod' item={item} />);
            break;
            // 메뉴 제거
            case 'item-remove':
                boxOpen(<RmConfirmBox
                    rmId={String(item.id)}
                    title={item.label}
                    msg={`Do you want to remove the menu?`}
                />);
            break;
        }
    });
}

/**
 * 우클릭 메뉴 가져오기
 */
function getCtxMenu(
    label: string   // 메뉴 맨위 표기될 라벨 명
) {
    _CTX_MENUS[0].label = label;
    return _CTX_MENUS;
}

//* 우클릭 메뉴 리스트
const _CTX_MENUS: CtxMenuItem[] = [
    {type: 'label', label: '', value: ''},
    {type: 'item', label: 'Add submenu', value: 'item-add',    icon: <IconPlus size={16} /> },
    {type: 'item', label: 'Modify menu', value: 'item-mod',    icon: <IconEdit size={16} /> },
    {type: 'item', label: 'Remove',      value: 'item-remove', icon: <IconTrash size={16} /> },
];