import { useEffect, useState } from "react"
import { Flex, TextInput, Button } from "@mantine/core"
import { useStore } from "zustand";

import { TREE_ITEM, useTreeStore } from '../'
import { useCtxBoxStore } from '@/compos/ui/ctx-box'

/**
 * [마우스 우클릭]
 * 편집 Box
 */
export function EditBox({title, item, mode, isRoot=false}: {
    title: string;          // 제목
    item: TREE_ITEM;        // 트리 아이템
    mode: 'add' | 'mod';    // 편집 모드 (add: 추가, mod: 수정)
    isRoot?: boolean;       // 루트 여부
}){
    const treeStore = useTreeStore();

    const [value, setValue] = useState('');
    const { addTreeItem, modTreeItem } = useStore(treeStore, s => s);
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
            addTreeItem(String(item.id), value, isRoot);
        }
        // 메뉴 수정
        else {
            modTreeItem(String(item.id), value);
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