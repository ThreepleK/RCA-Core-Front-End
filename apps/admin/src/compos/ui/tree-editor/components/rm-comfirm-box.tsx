import { Flex, Text, Title, Button } from "@mantine/core"
import { useCtxBoxStore } from '@/compos/ui/ctx-box'
import { useStore } from "zustand";
import { useTreeStore } from "../tree-editor-store-ctx";

/**
 * [마우스 우클릭]
 * 삭제 확인 Box
 */
export function RmConfirmBox({ title, msg, rmId }: {
    title: string;      // 제목
    msg: string;        // 내용
    rmId: string;       // 삭제 할 트리 아이템 id
}){
    const treeStore = useTreeStore();
    const { rmTreeItem } = useStore(treeStore, s => s);
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