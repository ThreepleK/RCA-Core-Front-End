import { Input, Switch, Table } from '@mantine/core';
import { StrictMode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableRow from '@/features/sidebar-menu/components/sortable-table';
import ActionTableRow from '@/features/sidebar-menu/components/action-table';

import style from './content-area.module.css'

interface RowData {
  id: number;
  name: string;
  displayName:  string;
  active: boolean;
}

const initialData: RowData[] = [
  { id: 1, name: 'Search', displayName: 'Search', active: true },
  { id: 2, name: 'My Work', displayName: 'My Work', active: true },
  { id: 3, name: 'Notifications', displayName: 'Notifications', active: true },
  { id: 4, name: 'Dashboards', displayName: 'Dashboards', active: true },
];

const coreData: RowData[] = [
  { id: 1, name: 'Search', displayName: 'Search', active: true },
  { id: 2, name: 'My Work', displayName: 'My Work', active: true },
  { id: 3, name: 'Notifications', displayName: 'Notifications', active: true },
  { id: 4, name: 'Dashboards', displayName: 'Dashboards', active: true },
];

const initialHubData: RowData[] = [
  { id: 123, name: 'Detector', displayName: 'Search', active: true },
  { id: 241, name: 'RCA', displayName: 'Search', active: true },
  { id: 3435, name: 'RUL', displayName: 'Search', active: true },
  { id: 423, name: 'Data Pipeline', displayName: 'Search', active: true },
];

const initialCunstomData: RowData[] = [
  { id: 1, name: 'custom-app', displayName: 'Search', active: true },
  { id: 2, name: 'custom-app2', displayName: 'Search', active: true },
  { id: 3, name: 'Google', displayName: 'Search', active: true },
];

export function ContentArea({ className }: {
    className: string
}){
    const navigate = useNavigate();
    const [data, setData] = useState<RowData[]>(initialData);
    const [hubData, setHubData] = useState<RowData[]>(initialHubData);
    const [customData, setCustomData] = useState<RowData[]>(initialCunstomData);
    const sensors = useSensors(useSensor(PointerSensor));
    const handleInputChange = (id: number, value: string) => {
      setData(prev =>
        prev.map(row => (row.id === id ? { ...row, name: value } : row))
      );
    };
  
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
  
      if (active.id !== over?.id) {
        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);
        setHubData((items) => arrayMove(items, oldIndex, newIndex));
      }
    };
  
    const handleCustomDragEnd = (event: any) => {
      const { active, over } = event;
  
      if (active.id !== over?.id) {
        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);
        setCustomData((items) => arrayMove(items, oldIndex, newIndex));
      }
    };
  
    const handleToggleChange = (id: number, checked: boolean) => {
      setData(prev =>
        prev.map(row => (row.id === id ? { ...row, active: checked } : row))
      );
    };
  
    const onClick = () => {
      navigate('/admin/permission');
    }
  
    const handleNameChange = (id: number, value: string) => {
      setData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, name: value } : row))
      );
    };
  
    const handleEdit = (id: number) => {
      alert(`Edit row ${id}`);
    };
  
    const handleDelete = (id: number) => {
      setData((prev) => prev.filter((row) => row.id !== id));
    };
  
  
    return <div className={className}>
      <div className={style['core-table']}>
        <h1 className={style.title}>Core feature</h1>
          <Table
            highlightOnHover
            withColumnBorders
            className={style.table}
            striped
            withTableBorder
          >
            <Table.Thead className={style.head}>
              <Table.Tr>
                <Table.Th className={style.row}>Name</Table.Th>
                <Table.Th className={style.row}>Display Name</Table.Th>
                <Table.Th className={style.row}>Display</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {coreData.map((row) => (
                <Table.Tr key={row.id} className={style.body}>
                  <Table.Td className={style['body-row']}>{row.name}</Table.Td>
                  <Table.Td className={style['body-row']}>
                    <Input
                      value={row.displayName}
                      onChange={(e) => handleInputChange(row.id, e.currentTarget.value)}
                      size="xs"
                      className={style.input}
                    />
                  </Table.Td>
                  <Table.Td className={style['body-row']}>
                    <Switch
                      checked={row.active}
                      onChange={(e) => handleToggleChange(row.id, e.currentTarget.checked)}
                      size="sm"
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
      </div>
      <div className={style['core-table']}>
      <h1 className={style.title}>Application Hub</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <Table
            highlightOnHover
            withColumnBorders
            striped
            withTableBorder
            className={style.table}
          >
            <Table.Thead className={style.head}>
              <Table.Tr>
                <Table.Th className={style.drag}></Table.Th>
                <Table.Th className={style.row}>Name</Table.Th>
                <Table.Th className={style.row}>Display Name</Table.Th>
                <Table.Th className={style.row}>Display</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody> 
              {hubData.map((row) => (<SortableRow key={row.id} row={row} onNameChange={handleNameChange} onToggleChange={handleToggleChange} />))}
          </Table.Tbody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
      <div className={style['custom-table']}>
        <div className={style['title-div']}>
        <span className={style.title}>Custom Level 1</span>
        <div className={style['button-div']}>
          <button className={style.button}>
            Add level 1 menu
          </button>
          <button className={style['add-button']}>
            Add custom link
          </button>
        </div>
        </div>  
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCustomDragEnd}>
            <SortableContext items={data.map((d) => d.id)} strategy={verticalListSortingStrategy}>
              <Table
                highlightOnHover
                withColumnBorders
                striped
                withTableBorder
                className={style.table}
              >
                <Table.Thead className={style.head}>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <Table.Th className={style.drag}></Table.Th>
                  <Table.Th className={style.row}>Name</Table.Th>
                  <Table.Th className={style.row}>Display Name</Table.Th>
                  <Table.Th className={style.row}>Action</Table.Th>
                </tr>
                </Table.Thead>
                <Table.Tbody>
                  {customData.map((row) => (
                    <ActionTableRow
                      key={row.id}
                      row={row}
                      onNameChange={handleNameChange}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </Table.Tbody>
              </Table>
            </SortableContext>
          </DndContext>
      </div>
    </div> ;
  }


export default ContentArea;