import { Flex, Group, Title, Button } from "@mantine/core";
import { DB_MENU_ITEM, MenuEditor } from "./components/menu-editor";
import { ContentArea } from "./components/content-area";

import style from "./style.module.css";

const ApplicationMenu = () => {
    return (
        <section className={style.section} style={{'--edit-width': '300px'} as any}>
            <Flex justify='space-between' className={style['title-area']}>
                <Title order={2} className={style.title}>Application Menu</Title>
                <Group gap="xs">
                    <Button size='xs' variant="default">Cancel</Button>
                    <Button size='xs'>Apply</Button>
                </Group>
            </Flex>
            <MenuEditor menu={_DB_RAW_DATA} />
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