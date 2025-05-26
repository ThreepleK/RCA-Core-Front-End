import { Button, Flex } from "@mantine/core";

import { ContentsLayout } from "@/compos/layout";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";

import { useSendAction } from "./stores";
import { IconPlus } from "@tabler/icons-react";
import { Grid } from "./components/grid";

import style from './style.module.css'
import { SideArea } from "./components/side-area";
import { TreeProvider } from "@/compos/ui/tree-editor";
import { useEffect, useMemo, useState } from "react";
import { DB_MENU_ITEM } from "../application-menu/components";
import { api_treeList } from "./apis";

export function Users(){
    const [reloadFlag, setReloadFlag] = useState(false);
    const [menuData, setMenuData] = useState<DB_MENU_ITEM[]|null>(null);

    //* 로딩 여부
    const isLoading = useMemo(() => (menuData === null), [menuData]);
    const sendEvent = useSendAction(s => s.sendEvent);

    //* 메뉴 데이터 가져오기
    useEffect(() => {
        api_treeList().then(({ isErr, res }) => {
            if( isErr ){ return; }
            setMenuData(res);
        });
    }, [reloadFlag]);

    //* 메뉴 변경 처리
    const onMenuChange = (data: DB_MENU_ITEM[]) => {
        console.log('data', data);
        // 변경된 메뉴랑 원본 메뉴량 합치기
        // const result = dbRawContainData(data, menuData);
        // 저장 요청
        // api_setMenuData(result).then(({isErr}) => {
        //     // 데이터 초기화
        //     setMenuData(null);
        //     // 변경된 데이터로 새로 불러오기
        //     setReloadFlag(!reloadFlag);
        // });
    };

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
            title='Oranization Structure'
            titleRightSide={
                <Flex justify='flex-end' gap='xs'>
                    <DropdownMenu label='Actions' menuList={_ACTION_MENUS} onActions={onActions} />
                    <Button size="xs" radius="md"
                        leftSection={<IconPlus size={14} />}
                        onClick={onCreate}
                    >Create user</Button>
                </Flex>
            }
            CtxProvider={TreeProvider}
            sideAreaWidth='300px'
            sideArea={!isLoading && <SideArea menu={menuData} onMenuChange={onMenuChange} />}
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