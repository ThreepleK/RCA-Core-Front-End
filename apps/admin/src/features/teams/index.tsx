import { useState } from "react";
import { ActionIcon, Button, Flex, Group, Modal, Title } from "@mantine/core";
import { ContentArea } from "./components/content-area/content-area";
import style from "./style.module.css";
import { PlusIcon } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const Teams = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [isCancel, setIsCancel] = useState<boolean>(false);
    const [isApply, setIsApply] = useState<boolean>(false);

    const [visible, setVisible] = useState(false);


    const handleCreateButton = () => {
      console.log('Create Team button clicked');
    };
    
        
    const handleCancelButton = () => {
        setIsCancel(true);
    };
    

  return (
    <section className={style.section} style={{'--edit-width': '300px'} as any}>
      <Flex justify='space-between' className={style['title-area']}>
        <Title order={5} className={style.title}>Team List</Title>
        <Group gap="xs">
            <Button leftSection={<PlusIcon />} size='xs' onClick={open}>Create Team</Button>
            <ActionIcon variant="default">
              <IconDotsVertical size={18} />
            </ActionIcon>
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