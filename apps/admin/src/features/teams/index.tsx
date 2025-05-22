import {
  Button,
  Checkbox,
  Flex,
  Group,
  Modal,
  Stack,
  TextInput,
  Text,
} from "@mantine/core";
import { useForm } from '@mantine/form';
import { ContentArea } from "./components/content-area/content-area";
import style from "./style.module.css";

import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ContentsLayout } from "@/compos/layout";

const Teams = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      members: "",
    },
  });

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    // Handle form submission logic here
  };
  
  return (
    <ContentsLayout
      title={<>Teams</>}
      titleRightSide={
        <>
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
              onClick={() => console.log("Show menu")}
            >
              <IconChevronDown size={14} />
            </Button>
          </Group>
        </>
      }
    >
      <ContentArea />
      <Modal opened={opened} onClose={close} title="Create Team">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Stack>
            <TextInput
              label="Name"
              required
              // leftSection={<IconAt size={16} />}
            />

            <Group justify="space-between" mt="md">
              <Checkbox label="Create more teams" mt="md" required />
              <Button type="submit">Save</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </ContentsLayout>
  );
};

export default Teams;

