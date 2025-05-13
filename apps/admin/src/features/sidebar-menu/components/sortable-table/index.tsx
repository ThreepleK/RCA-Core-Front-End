import { Input, Switch, Table } from '@mantine/core';
import { GripVertical } from 'lucide-react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Style from './style.module.css'

interface RowData {
  id: string;
  name: string;
  displayName: string;
  active: boolean;
}

export interface IFetchSidebarMenuItem {
  name: string;
  id: string;
  displayName: string;
  level: number;
  url: string;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
  applicationId?: string;
  menuGroupId?: string;
  itemType?: string;
}

export default function SortableRow({
  row,
  onNameChange,
  onToggleChange,
}: {
  row: IFetchSidebarMenuItem;
  onNameChange: (id: string, value: string, rowData: any) => void;
  onToggleChange: (id: string, checked: boolean, rowData: any) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef
  } = useSortable({ id: row.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
  <Table.Tr ref={setNodeRef} key={row.id} className={Style.column}>
    <Table.Td className={Style.body}>
      <button
        ref={setActivatorNodeRef}  // Drag handle을 설정
        {...listeners}
        {...attributes}
        className={Style.button}
      >
        <GripVertical size={16} />
      </button>
    </Table.Td>
    <Table.Td className={Style['body-row']}>{row.name}</Table.Td>
    <Table.Td className={Style['body-row']}>
      <Input
        value={row.displayName}
        onChange={(e) => onNameChange(row.id, e.currentTarget.value, row)}
        size="xs"
        className={Style.input}
      />
    </Table.Td>
    <Table.Td className={Style['body-row']}>
      <Switch
        checked={row.isVisible}
        onChange={(e) => onToggleChange(row.id, e.currentTarget.checked, row)}
        size="sm"
        color="teal"
      />
    </Table.Td>
  </Table.Tr>
  )
}