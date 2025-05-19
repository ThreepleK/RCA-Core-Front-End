import { useEffect, useState } from "react";
import { Button, Flex, Group, Title } from "@mantine/core";
import style from "./style.module.css";
import { request } from '@/utils/request'
import ContentArea from "./components/content-area/content-area";

const Branding = () => {
  const [isCancel, setIsCancel] = useState(false);

    const handleApplyButton = () => {
      console.log('apply button clicked');
    };

    const handleCancelButton = () => {
      setIsCancel(true);
    };

  return (
    <section className={style.section} style={{'--edit-width': '300px'} as any}>
        <Flex justify='space-between' className={style['title-area']}>
            <Title order={5} className={style.title}>Branding</Title>
            <Group gap="xs">
                <Button size='xs' variant="default" onClick={() => handleCancelButton()}>Cancel</Button>
                <Button size='xs' onClick={() => handleApplyButton()}>Apply</Button>
            </Group>
        </Flex>
        <ContentArea className={style['cont-area']} isCancel={isCancel} onChangeCancel={setIsCancel}/>
    </section>
);
}

export default Branding;