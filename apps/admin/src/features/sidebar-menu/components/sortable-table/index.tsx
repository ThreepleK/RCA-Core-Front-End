import { Input, Switch } from '@mantine/core';
import { GripVertical } from 'lucide-react';
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

export default function SortableRow({
  row,
  onNameChange,
  onToggleChange,
}: {
  row: RowData;
  onNameChange: (id: number, value: string) => void;
  onToggleChange: (id: number, checked: boolean) => void;
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
    <tr
      ref={setNodeRef}
      style={style}
      className={Style.column}
    >
      <td className={Style.body}>
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className={Style.button}
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className={Style['body-row']}>{row.name}</td>
      <td className={Style['body-row']}>
        <Input
          value={row.displayName}
          onChange={(e) => onNameChange(row.id, e.currentTarget.value)}
          size="xs"
          className={Style.input}
        />
      </td>
      <td className={Style['body-row']}>
        <Switch
          checked={row.active}
          onChange={(e) => onToggleChange(row.id, e.currentTarget.checked)}
          size="sm"
        />
      </td>
    </tr>
  );
}