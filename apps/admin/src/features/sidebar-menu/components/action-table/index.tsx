import { ActionIcon, Input, Switch, Table } from '@mantine/core';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
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

export default function ActionTableRow({
  row,
  onNameChange,
  onUrlChange,
  onToggleChange,
  onEdit,
  onDelete,
}: {
  row: IFetchSidebarMenuItem;
  onNameChange: (id: string, value: string, row: any) => void;
  onUrlChange: (id: string, value: string) => void;
  onToggleChange: (id: string, checked: boolean, row: any) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, row: any) => void;
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
    <Table.Tr ref={setNodeRef} style={style} className={Style.column}>
      <Table.Td className={Style.body}> 
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className={Style.button}
        >
          <GripVertical size={16} />
        </button>
      </Table.Td>
      {/* <Table.Td className={Style['body-row']}>{row.name}</Table.Td> */}
      <Table.Td className={Style['body-row']}>
        <Input
          value={row.displayName}
          onChange={(e) => onNameChange(row.id,  e.currentTarget.value, row)}
          size="xs"
          className={Style.input}
        />
      </Table.Td>
      <Table.Td className={Style['body-row']}>
        <Input
          value={row.url}
          onChange={(e) => onUrlChange(row.id, e.currentTarget.value)}
          size="xs"
          className={Style.input}
        />
      </Table.Td>
      <Table.Td className={Style['body-row']}>
        <Switch
          checked={row.isVisible}
          onChange={(e) => onToggleChange(row.id, e.currentTarget.checked, row)}
          size="sm"
        />
      </Table.Td>
      <Table.Td className={Style['body-row']}>
        <div className="flex space-x-2">
          {/* <ActionIcon variant="light" color="blue" onClick={() => onEdit(Number(row.id))}>
            <Pencil size={16} />
          </ActionIcon> */}
          <ActionIcon variant="light" color="red" onClick={() => onDelete(row.id, row)}>
            <Trash2 size={16} />
          </ActionIcon>
        </div>
      </Table.Td>
    </Table.Tr>
  );
}