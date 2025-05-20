import { useState } from "react";
import { Button, Flex, Group, Modal, Title } from "@mantine/core";
import { ContentArea } from "./components/content-area/content-area";
import style from "./style.module.css";

import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const Teams = () => {
    const [opened, { open, close }] = useDisclosure(false);
    
  return (
    <section className={style.section} style={{'--edit-width': '300px'} as any}>
      <Flex justify='space-between' className={style['title-area']}>
        <Title order={5} className={style.title}>Team List</Title>
        <Group gap={0}>
          <Button
            leftSection={<IconPlus size={14} />}
            size="xs"
            color="blue"
            radius="md"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={open}
          >
            Create team
          </Button>
          <Button
            size="xs"
            color="blue"
            radius="md"
            px={8}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={() => console.log('Show menu')}
          >
            <IconChevronDown size={14} />
          </Button>
        </Group>
      </Flex>
      <ContentArea className={style['cont-area']} />
      <Modal opened={opened} onClose={close} title="Create Team">
        {/* Modal content */}
      </Modal>
    </section>
  );
}

export default Teams;