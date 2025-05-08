import { ActionIcon, Input, Switch, Table } from '@mantine/core';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Style from './style.module.css'

interface RowData {
  id: number;
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
  applicationId: string;
  menuGroupId: string;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
}

export default function ActionTableRow({
  row,
  onNameChange,
  onEdit,
  onDelete,
}: {
  row: IFetchSidebarMenuItem;
  onNameChange: (id: number, value: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
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
      <Table.Td className={Style['body-row']}>{row.name}</Table.Td>
      <Table.Td className={Style['body-row']}>
        <Input
          value={row.displayName}
          onChange={(e) => onNameChange(Number(row.id), e.currentTarget.value)}
          size="xs"
          className={Style.input}
        />
      </Table.Td>
      <Table.Td className={Style['body-row']}>
        <div className="flex space-x-2">
          {/* <ActionIcon variant="light" color="blue" onClick={() => onEdit(Number(row.id))}>
            <Pencil size={16} />
          </ActionIcon> */}
          <ActionIcon variant="light" color="red" onClick={() => onDelete(Number(row.id))}>
            <Trash2 size={16} />
          </ActionIcon>
        </div>
      </Table.Td>
    </Table.Tr>
  );
}