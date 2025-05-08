import { Button, Flex, Group, Title } from "@mantine/core";
import { ContentArea } from "./components/content-area/content-area";

import style from "./style.module.css";

const ApplicationMenu = () => {

  return (
    <section className={style.section} style={{'--edit-width': '300px'} as any}>
        <Flex justify='space-between' className={style['title-area']}>
            <Title order={2} className={style.title}>SideBar Menu</Title>
            <Group gap="xs">
                <Button size='xs' variant="default">Cancel</Button>
                <Button size='xs'>Apply</Button>
            </Group>
        </Flex>
        <ContentArea className={style['cont-area']} />
    </section>
);
}

export default ApplicationMenu;