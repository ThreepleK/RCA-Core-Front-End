import { Button, Flex, Group, Modal, Title } from "@mantine/core";

import style from "./style.module.css";

import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ContentsLayout } from "@/compos/layout";
import { ContentArea } from "./components/content-area/content-area";

const Users = () => {
  const [opened, { open, close }] = useDisclosure(false);
    
  return (
    <ContentsLayout
      title={<>Users</>}
      titleRightSide={<>
        <Group gap={0}>
          <Button
            leftSection={<IconPlus size={14} />}
            size="xs"
            color="blue"
            radius="md"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={open}
          >
            Create user
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
      </>}
    >
      <ContentArea />
      <Modal opened={opened} onClose={close} title="Create User">
        {/* Modal content */}
      </Modal>
    </ContentsLayout>
  );
}

export default Users;