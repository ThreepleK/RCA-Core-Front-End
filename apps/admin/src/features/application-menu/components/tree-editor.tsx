import { IconFolder, IconFolderOpen, IconFile, IconTrash, IconPlus, IconEdit } from '@tabler/icons-react';
import { useEffect, useState, forwardRef, useMemo } from 'react';
import { TextInput, Text, Button, Group, Title, Flex } from '@mantine/core';
import { SimpleTreeItemWrapper, SortableTree, TreeItemComponentProps } from 'dnd-kit-sortable-tree';

import { useCtxMenuStore, CtxMenuItem } from '../stores'
import { useTreeStore, TREE_ITEM, TREE_LIST } from '../stores'
import { useCtxBoxStore } from '../stores'

import style from "../style.module.css";

/**
 * 사이드 영역
 */
export function TreeEditor({className, list}: {
    className: string;
    list: TREE_LIST;
}){
    const {flag, setTreeList} = useTreeStore(s => s);
    const items = useMemo(() => list, [flag]);

    return <>
        {list.length === 0
            ? <Text className={style['no-tree-data']}>Please add a menu item.</Text>
            : <div className={className}>
                <SortableTree
                    items={items}
                    onItemsChanged={setTreeList}
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
    const {
        setOpen: setBoxOpen,
        setPosition: setBoxPosition,
        setContent: setBoxContent
    } = useCtxBoxStore(s => s);

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

        // 우클릭 메뉴 설정
        const menu: CtxMenuItem[] = [
            {type: 'label', label: props.item.label, value: ''},
            {type: 'item', label: 'Add submenu', value: 'item-add', icon: <IconPlus size={16} />},
            {type: 'item', label: 'Modify menu', value: 'item-mod', icon: <IconEdit size={16} />},
            {type: 'item', label: 'Remove', value: 'item-remove', icon: <IconTrash size={16} /> },
        ];

        // 메뉴 설정 및 선택 이벤트 처리
        setMenuList(menu, (selected) => {
            switch( selected ){
                // 하위 메뉴 추가
                case 'item-add':
                    setBoxContent(<EditBox title='Add submenu' mode='add' item={props.item} />);
                    setBoxPosition(clientX, clientY);
                    setBoxOpen(true);
                break;
                // 메뉴 이름 수정
                case 'item-mod':
                    setBoxContent(<EditBox title='Modify menu' mode='mod' item={props.item} />);
                    setBoxPosition(clientX, clientY);
                    setBoxOpen(true);
                break;
                // 메뉴 제거
                case 'item-remove':
                    setBoxContent(<RmConfirmBox
                        title={props.item.label}
                        msg={`Do you want to remove the menu?`}
                        rmId={String(props.item.id)}
                    />);
                    setBoxPosition(clientX, clientY);
                    setBoxOpen(true);
                break;
            }
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
 * 삭제 확인 Box
 */
function RmConfirmBox({ title, msg, rmId }: {
    title: string;
    msg: string;
    rmId: string;
}){
    const { rmTreeItem } = useTreeStore(s => s);
    const { setOpen } = useCtxBoxStore(s => s);

    //* 삭제
    const onRemove = () => {
        rmTreeItem(rmId);
        setOpen(false);
    }

    return <>
        <Title order={5} c="red">{title}</Title>
        <Text size='xs'>{msg}</Text>
        <Flex
            gap="xs"
            justify="flex-end"
            align="center"
            direction="row"
            className='mt-2'
        >
            <Button size='xs' color='red' onClick={onRemove}>Remove</Button>
        </Flex>
    </>;
}

/**
 * 편집 Box
 */
export function EditBox({title, item, mode, isRoot=false}: {
    title: string;
    item: any
    mode: 'add' | 'mod'
    isRoot?: boolean;
}){
    const [value, setValue] = useState('');
    const { addTreeItem, modTreeItem } = useTreeStore(s => s);
    const { setOpen } = useCtxBoxStore(s => s);

    useEffect(() => {
        if( mode === 'mod' ){
            setValue(item.label);
        } else {
            setValue('');
        }
    }, [item.label])

    //* 변경 이벤트 
    const onChange = () => {
        // 메뉴 추가
        if( mode === 'add' ){
            addTreeItem(item.id, value, isRoot);
        }
        // 메뉴 수정
        else {
            modTreeItem(item.id, value);
        }

        setOpen(false);
        setValue('');
    }

    return <>
        {/* input */}
        <TextInput
            size='xs'
            label={title}
            description={item.label}
            value={value}
            onKeyUp={(e) => { if( e.keyCode === 13 ){ onChange(); } }}
            onChange={(event) => setValue(event.currentTarget.value)}
            autoFocus={true}
        />

        {/* 버튼 */}
        <Flex
            gap="xs"
            justify="flex-end"
            align="center"
            direction="row"
            className='mt-2'
        >
            <Button size='xs' className='w-full!' onClick={onChange}>
                {mode === 'add' ? 'Add' : 'Modify'}
            </Button>
        </Flex>
    </>;
}

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