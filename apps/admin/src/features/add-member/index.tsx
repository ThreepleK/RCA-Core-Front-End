import { Button, Text, Group, Modal, Stack, Textarea, TextInput, Title } from "@mantine/core";

import style from "./style.module.css";

import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ContentsLayout } from "@/compos/layout";
import { ContentArea } from "./components/content-area/content-area";
import { CreateModal, EditModal, useCreateModalStore } from "@/compos/ui/modal";

const AddMember = () => {

  return (
    <ContentsLayout
      title={<>Add Members</>}
      titleRightSide={<>
        <Group gap={0}>

        </Group>
      </>}
    >
      <ContentArea />
    </ContentsLayout>
  );
}

export default AddMember;
