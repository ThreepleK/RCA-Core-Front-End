import { columnFilters, DataGrid } from "@/compos/ui/data-grid";
import {
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

import { ConfirmModal, EditModal, useConfirmModalStore, useEditModalStore } from "@/compos/ui/modal";

export function SelectedArea() {
  
  return (
    <div>
      <Title order={3} mb="md"> 
        Selected Area
        </Title>
    </div>
  );
}