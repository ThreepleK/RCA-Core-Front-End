import { Input, Switch, Table } from '@mantine/core';
import { useState } from 'react';
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

import style from './user-group.module.css'

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
  { id: 1, name: 'Detector', displayName: 'Search', active: true },
  { id: 2, name: 'RCA', displayName: 'Search', active: true },
  { id: 3, name: 'RUL', displayName: 'Search', active: true },
  { id: 4, name: 'Data Pipeline', displayName: 'Search', active: true },
];

const initialCunstomData: RowData[] = [
  { id: 1, name: 'custom-app', displayName: 'Search', active: true },
  { id: 2, name: 'custom-app2', displayName: 'Search', active: true },
  { id: 3, name: 'Google', displayName: 'Search', active: true },
];

const UserGroup = () => {
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


  return  <div className={style.layout} style={{'--side-width': '250px'} as any}>
    <h1 className="text-2xl font-bold px-2 mb-10">Sidebar menu</h1>
      
    <div className="text-2xl font-bold px-2 mb-5">
      <h1 className="text-xl font-bold mb-2 gap-2">Core feature</h1>
        <Table
          highlightOnHover
          withColumnBorders
          className="min-w-full text-sm text-gray-700"
          striped
          withTableBorder
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Display Name</th>
              <th className="px-4 py-2 text-left">Display</th>
            </tr>
          </thead>
          <tbody>
            {coreData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-2 border-r border-gray-200">{row.name}</td>
                <td className="px-4 py-2 border-r border-gray-200">
                  <Input
                    value={row.displayName}
                    onChange={(e) => handleInputChange(row.id, e.currentTarget.value)}
                    size="xs"
                    className="w-48"
                  />
                </td>
                <td className="px-4 py-2">
                  <Switch
                    checked={row.active}
                    onChange={(e) => handleToggleChange(row.id, e.currentTarget.checked)}
                    size="sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    </div>
    <div className="text-2xl font-bold px-2 mb-5">
      <h1 className="text-xl font-bold mb-2 gap-2">Application Hub</h1>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            <Table
              highlightOnHover
              withColumnBorders
              striped
              withTableBorder
              className="min-w-full text-sm text-gray-700"
            >
              <thead className="bg-gray-100">
              <tr>
                <th className="pl-4 pr-2 py-2 w-10"></th> {/* drag handle */}
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Display Name</th>
                <th className="px-4 py-2 text-left">Display</th>
              </tr>
              </thead>
              <tbody>
                {hubData.map((row) => (
                  <SortableRow
                    key={row.id}
                    row={row}
                    onNameChange={handleNameChange}
                    onToggleChange={handleToggleChange}
                  />
                ))}
              </tbody>
            </Table>
          </SortableContext>
        </DndContext>
    </div>
    <div className="mb-5 px-2">
      <div className="flex items-center justify-between mb-2 gap-2">
      <span className="text-xl font-bold leading-none">Custom Level 1</span>
      <div className="flex gap-2 text-xs">
        <button className="px-2 py-1 rounded border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 leading-none">
          Add level 1 menu
        </button>
        <button className="px-3 py-1.5 rounded border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 leading-none">
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
              className="min-w-full text-sm text-gray-700"
            >
              <thead className="bg-gray-100">
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th className="pl-4 pr-2 py-2 w-10"></th> {/* drag handle */}
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Display Name</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
              </thead>
              <tbody>
                {customData.map((row) => (
                  <ActionTableRow
                    key={row.id}
                    row={row}
                    onNameChange={handleNameChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </Table>
          </SortableContext>
        </DndContext>
    </div>
  </div>;
}

export default UserGroup;