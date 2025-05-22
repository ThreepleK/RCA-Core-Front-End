import { Button, Text, Group, Modal, Stack, Textarea, TextInput, Title } from "@mantine/core";

import style from "./style.module.css";

import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ContentsLayout } from "@/compos/layout";
import { ContentArea } from "./components/content-area/content-area";
import { CreateModal, EditModal, useCreateModalStore } from "@/compos/ui/modal";

const Users = () => {
  const [opened, { open, close }] = useDisclosure(false);
    
  //* 저장
  const handleCreate = () => {
    // 확인 모달
    SaveModal("create", () => {});
  };

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
            onClick={handleCreate}
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
      <CreateModal />
      <EditModal />
    </ContentsLayout>
  );
}

export default Users;

/**
 * [모달] 생성
 */
function SaveModal(
  label: string, // 관련 라벨
  callback: () => void // 확인 콜백
) {
  //* 모달
  const { setOpen, setContent, setValue } = useCreateModalStore.getState();

  // 취소 모달
  setContent(
    <Text size="md" fw={500} c="blue">
      Create Team
    </Text>,
    <Stack>
      <TextInput
        label="Team Name"
        required
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Textarea
        label="Description"
        placeholder="Input placeholder"
      />
      <Group justify="space-between" mt="md">
        {/* <Button type="submit">Save</Button> */}
      </Group>
    </Stack>,
    "Save",
    callback
  );
  setOpen(true);
}
