import { Flex, TextInput, Switch, Button, Text } from '@mantine/core';
import { TREE_ITEM_TYPE, useTreeStore } from '@/compos/ui/tree-editor';

import { useEffect, useState } from 'react';
import { useConfirmModalStore } from '@/compos/ui/modal';
import style from './content-area.module.css'
import { useSendSelectedItem } from '../../stores';

export function Settings(){
    const {selectedItem, setSelectedItem} = useSendSelectedItem(s => s);

    //* 선택된 메뉴가 없을 때
    if( selectedItem === null ){
        return <>Please select the team on the left.</>;
    }

    //* 저장하기
    const onSave = (label: string, data: TREE_ITEM_TYPE['nodeProps']) => {       
        // // 내용 업데이트
        // updateTreeItem(
        //     String(selectedItem.id),
        //     label,
        //     data
        // );

        // // 저장 요청
        // setIsUpdate(true);
    }

    return <EditForm
        label={selectedItem.name}
        data={selectedItem}
        onSave={onSave}
    />
}

/**
 * 폼
 */
function EditForm({ label, data, onSave }: {
    label: string;
    data: TREE_ITEM_TYPE['nodeProps'];
    onSave: (label: string, data: TREE_ITEM_TYPE['nodeProps']) => void;
}){
    const [name, setName] = useState(label);
    const [item, setItem] = useState<TREE_ITEM_TYPE['nodeProps']>(data);

    //* 모달
    const { setOpen: modalOepn, setContent: modalCont } = useConfirmModalStore(s => s);

    useEffect(() => { setName(label) }, [label]);
    useEffect(() => { setItem(data) }, [data]);

    // 라벨명
    const onChangeName = (e: any) => setName(e.currentTarget.value);
    // input 데이터
    const onChangeData = (e: any, type: string) => {
        const val = e.currentTarget.value;
        setItem((item) => {
            if( !item ){ return undefined; }
            return {
                ...item,
                [type]: val
            };
        });
    };
    // switch 데이터
    const onChangeSwitch = (e: any, type: string) => {
        const val = e.currentTarget.checked;
        setItem((item) => {
            if( !item ){ return undefined; }
            return {
                ...item,
                [type]: val
            };
        });
    }

    // Update 확인
    const onConfirm = () => {
        // 확인 모달
        modalCont(
            <Text size='md' fw={500} c='blue'>Apply menu edit</Text>,
            <Text size='sm'>
                Would you like to edit this content?
            </Text>
        , 'Update', () => {
            onSave(name, item);
        });
        modalOepn(true);
    }
    
    return (
        <Flex direction="column" gap="xs" justify="center" className={style['menu-info']}>
            <TextInput label="Team details" value={item?.name} onChange={e => onChangeSwitch(e, 'name')} />
 

            <Flex direction='column'>
                <Text size='sm' fw='500'>Active</Text>
                <Switch size='sm' color="teal"
                    onChange={e => onChangeSwitch(e, 'isActive')} checked={item?.isActive}
                />
            </Flex>

            <Flex direction='column'>
                <Text size='sm' fw='500'>Show</Text>
                <Switch size='sm' color="teal"
                    onChange={e => onChangeSwitch(e, 'isVisible')} checked={item?.isVisible}
                />
            </Flex>

            {/* <Button onClick={onConfirm}>Update</Button> */}
        </Flex>
    )
}