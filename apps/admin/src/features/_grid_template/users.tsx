import { Button, Flex } from "@mantine/core";

import { ContentsLayout } from "@/compos/layout";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";

import { useSendAction } from "./stores";
import { IconPlus } from "@tabler/icons-react";
import { Grid } from "./components/grid";

import style from './style.module.css'

export function Users(){
    const sendEvent = useSendAction(s => s.sendEvent);

    //* 추가
    const onCreate = () => {
        sendEvent('create');
    };

    //* 액션버튼
    const onActions = (key: string) => {
        sendEvent(`selected-${key}`);
    };

    return (
        <ContentsLayout
            title='Users'
            titleRightSide={
                <Flex justify='flex-end' gap='xs'>
                    <DropdownMenu label='Actions' menuList={_ACTION_MENUS} onActions={onActions} />
                    <Button size="xs" radius="md"
                        leftSection={<IconPlus size={14} />}
                        onClick={onCreate}
                    >Create user</Button>
                </Flex>
            }
        >
            <div className={style['cont-area']}>
                <Grid />
            </div>
        </ContentsLayout>
    );
}

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
    {key: 'deactive', label: 'Deactive member'},
    {key: 'delete', label: 'Delete member'},
];