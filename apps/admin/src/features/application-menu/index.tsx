import { useEffect, useState } from "react";
import { Flex, Title, LoadingOverlay } from "@mantine/core";
import { DB_MENU_ITEM, MenuEditor, dbRawContainData } from "./components";
import { ContentArea } from "./components/content-area";

import { api_getMenuData, api_setMenuData } from './apis'

import style from "./style.module.css";

const ApplicationMenu = () => {
    const [reloadFlag, setReloadFlag] = useState(false);
    const [menuData, setMenuData] = useState<DB_MENU_ITEM[]|null>(null);

    useEffect(() => {
        api_getMenuData().then(({ isErr, res }) => {
            if( isErr ){ return; }
            setMenuData(res);
        });
    }, [reloadFlag]);

    //* 메뉴 변경 처리
    const onMenuChange = (data: DB_MENU_ITEM[]) => {
        // 변경된 메뉴랑 원본 메뉴량 합치기
        const result = dbRawContainData(data, menuData);
        // 저장 요청
        api_setMenuData(result).then(({isErr}) => {
            // 데이터 초기화
            setMenuData(null);
            // 변경된 데이터로 새로 불러오기
            setReloadFlag(!reloadFlag);
        });
    };

    // 메뉴 데이터 로딩 시
    if( menuData === null ){
        return <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'blue', type: 'bar' }}
        />;
    }

    // 보여줄 화면
    return (
        <section className={style.section} style={{'--edit-width': '300px'} as any}>
            {/* 상단 타이틀 */}
            <Flex justify='space-between' className={style['title-area']}>
                <Title order={2} className={style.title}>Application Menu</Title>
                {/* <Group gap="xs">
                    <Button size='xs' variant="default">Cancel</Button>
                    <Button size='xs'>Apply</Button>
                </Group> */}
            </Flex>

            {/* 좌측 메뉴 에디터 */}
            <MenuEditor menu={menuData} onMenuChange={onMenuChange} />

            {/* 본문 영역 */}
            <ContentArea className={style['cont-area']} />
        </section>
    );
}

export default ApplicationMenu;