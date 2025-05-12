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

    // 메뉴 데이터 로딩 시
    if( menuData === null ){
        return <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'blue', type: 'bar' }}
        />;
    }

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

    // 보여줄 화면
    return (
        <section className={style.section} style={{'--edit-width': '300px'} as any}>
            <Flex justify='space-between' className={style['title-area']}>
                <Title order={2} className={style.title}>Application Menu</Title>
                {/* <Group gap="xs">
                    <Button size='xs' variant="default">Cancel</Button>
                    <Button size='xs'>Apply</Button>
                </Group> */}
            </Flex>
            <MenuEditor menu={menuData} onMenuChange={onMenuChange} />
            <ContentArea className={style['cont-area']} />
        </section>
    );
}

export default ApplicationMenu;


//* DB 임시 데이터 포맷
const _DB_RAW_DATA: DB_MENU_ITEM[] = [
    {
        level: 1,
        sortOrder: 1,
        id: '3',
        parentMenuId: null,
        name: 'detector',
        displayName: 'Detector',
        url: '/detector',
        openNewTab: false,
        isVisible: true,
    },
    {
        level: 2,
        sortOrder: 1,
        id: '4',
        parentMenuId: '3',
        name: 'detector_detail',
        displayName: 'Detail',
        url: '/detector/detail',
        openNewTab: false,
        isVisible: true,
    },
    {
        level: 2,
        sortOrder: 2,
        id: '5',
        parentMenuId: '3',
        name: 'detector_analysis',
        displayName: 'Analysis',
        url: '/detector/analysis',
        openNewTab: false,
        isVisible: true,
    },
    {
        level: 3,
        sortOrder: 1,
        id: '11',
        parentMenuId: '4',
        name: 'detector_detail_type_a',
        displayName: 'Type A',
        url: '/detector/detail/type_a',
        openNewTab: false,
        isVisible: true,
    },
    {
        level: 3,
        sortOrder: 2,
        id: '12',
        parentMenuId: '4',
        name: 'detector_detail_type_b',
        displayName: 'Type B',
        url: '/detector/detail/type_b',
        openNewTab: false,
        isVisible: true,
    },
    {
        level: 1,
        sortOrder: 1,
        id: '6',
        parentMenuId: null,
        name: 'data_pipeline',
        displayName: 'Data Pipeline',
        url: '/data_pipeline',
        openNewTab: false,
        isVisible: true,
    }
];