import { columnFilters, DataGrid } from "@/compos/ui/data-grid";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Drawer,
  Group,
  Input,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import { IconTrash, IconX } from "@tabler/icons-react";
import { useSelectedRowStore } from "./content-area-store";

export function SelectedArea() {
    const { data, setDeletedRow, setClear } = useSelectedRowStore();

    const handleDelete = (id: string) => {
      const filteredData = data?.filter((item) => item?.id !== id);
      setDeletedRow(filteredData);
    }

    const handleClear = () => {
      setClear(true);
      setDeletedRow(data);
    }

  return (
    <div>
      <Group mb="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title order={3}>Selected {" "}
          <Text span color="dimmed" style={{ marginLeft: '2px' }}>
               {data?.length} member(s) in total
          </Text>
        </Title>
        
        <ActionIcon variant="subtle" color="gray" >
            <IconTrash  onClick={() => handleClear()} /> 
        </ActionIcon>
      </Group>

        <Stack >
          {data?.map((item) => ( 
            <Group key={item?.id}  justify="space-between">
            <Text key={item?.id}>
              {item?.name}
              <Text span color="dimmed" style={{ marginLeft: '8px' }}>
               {item?.email}
              </Text>
            </Text>
            <ActionIcon color="gray" variant="subtle">
              <IconX size={16} onClick={() => handleDelete(item?.id)}/>
              </ActionIcon>
          </Group> ))}     
        </Stack>
    </div>
  );
}