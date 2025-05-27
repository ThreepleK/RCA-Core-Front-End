import { Button, Flex } from "@mantine/core";

import { ContentsLayout, useContsLayoutStore } from "@/compos/layout";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";

import { useSendAction } from "./stores";
import { IconPlus } from "@tabler/icons-react";
import { Grid } from "./components/grid";

import style from './style.module.css'
import { useEffect } from "react";
import { useStore } from "zustand";

export function Users(){

    return (
        <ContentsLayout>
            <ContentArea/>
        </ContentsLayout>
    );
}

function ContentArea(){
    const contLayout = useContsLayoutStore();

    //-- 컨텐츠 설정
    const setTitleLeft = useStore(contLayout, s => s.setTitleLeft);
    const setTitleRight = useStore(contLayout, s => s.setTitleRight);

    //* 초기 설정
    useEffect(() => {
        // 타이틀 설정
        setTitleLeft('Users');
        setTitleRight(<TitleRightSide />);
    }, []);
    
    return (
        <div className={style['cont-area']}>
            <Grid />
        </div>
    );
}

/**
 * 타이틀 우측
 */
function TitleRightSide(){
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
        <Flex justify='flex-end' gap='xs'>
            <DropdownMenu label='Actions' menuList={_ACTION_MENUS} onActions={onActions} />
            <Button size="xs" radius="md"
                leftSection={<IconPlus size={14} />}
                onClick={onCreate}
            >Create user</Button>
        </Flex>
    )
}

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
    {key: 'deactive', label: 'Deactive member'},
    {key: 'delete', label: 'Delete member'},
];