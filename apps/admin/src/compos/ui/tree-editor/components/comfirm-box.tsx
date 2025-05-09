import { Flex, Text, Title, Button } from "@mantine/core"

import { useCtxBoxStore } from '@/compos/ui/ctx-box'

/**
 * 확인 box
 */
export function ConfirmBox({ title, msg, callback }: {
    title: string;      // 제목
    msg: string;        // 내용
    callback: ()=>void; // 확인 콜백
}){
    const { setOpen } = useCtxBoxStore(s => s);

    //* 확인
    const onConfirm = () => {
        callback();
        setOpen(false);
    }

    return <>
        <Title order={5}>{title}</Title>
        <Text size='xs'>{msg}</Text>
        <Flex
            gap="xs"
            justify="flex-end"
            align="center"
            direction="row"
            className='mt-2'
        >
            <Button size='xs' color='red' onClick={onConfirm}>Confirm</Button>
        </Flex>
    </>;
}