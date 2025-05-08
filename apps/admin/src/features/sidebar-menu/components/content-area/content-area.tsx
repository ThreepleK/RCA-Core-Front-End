import { Input, Switch, Table } from '@mantine/core';
import { StrictMode, useEffect, useState } from 'react';
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

import { request } from '@/utils/request';
import SortableRow from '@/features/sidebar-menu/components/sortable-table';
import ActionTableRow from '@/features/sidebar-menu/components/action-table';
import style from './content-area.module.css'

export interface IFetchSidebarMenu {
  id: string;
  name: string;
  displayName: string;
  menus: IFetchSidebarMenuItem[];
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

export function ContentArea({ className }: {
    className: string
}){
    const navigate = useNavigate();
    const [data, setData] = useState<IFetchSidebarMenu[]>([]);
    const [coreData, setCoreData] = useState<IFetchSidebarMenuItem[]>([]);
    const [appData, setAppData] = useState<IFetchSidebarMenuItem[]>([]);
    const [customData, setCustomData] = useState<IFetchSidebarMenuItem[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));

    /*
    * 사이드바 메뉴 API 호출
    */
    useEffect(() => {
      request('get','/admin/api/menu/sidebar').then((res) => {
        setData(res.res)
      });
    }, []);

    useEffect(() => {
      if(!data) return;
      
      setCoreData(data[0]?.menus);
      setAppData(data[1]?.menus);
      setCustomData(data[2]?.menus);
    }, [data]);
    
    const handleInputChange = (id: string, value: string) => {
      setCoreData(prev =>
        prev.map(row => (row.id === id ? { ...row, displayName: value } : row))
      );
    };
  
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = appData.findIndex((item) => item.id === active.id);
        const newIndex = appData.findIndex((item) => item.id === over?.id);

        setAppData((items) => arrayMove(items, oldIndex, newIndex));  
      }
    };
  
    const handleCustomDragEnd = (event: any) => {
      const { active, over } = event;
  
      if (active.id !== over?.id) {

        const oldIndex = customData.findIndex((item) => item.id === active.id);
        const newIndex = customData.findIndex((item) => item.id === over?.id);

        setCustomData((items) => arrayMove(items, oldIndex, newIndex));  
      }
    };
  
    const handleToggleChange = (id: number, checked: boolean) => {
      const stringId = id.toString();
      setCoreData(prev =>
        prev.map(row => (row.id === stringId ? { ...row, isVisible: checked } : row))
      );
    };

    const handleAppToggleChange = (id: number, checked: boolean) => {
      const stringId = id.toString();
      setAppData(prev =>
        prev.map(row => (row.id === stringId ? { ...row, isVisible: checked } : row))
      );
    };

    const handleAppNameChange = (id: number, value: string) => {
      const stringId = id.toString();
      setAppData((prev) =>
        prev.map((row) => (row.id === stringId ? { ...row, name: value } : row))
      );
    };

    const handleCustomNameChange = (id: number, value: string) => {
      const stringId = id.toString();
      setCustomData((prev) =>
        prev.map((row) => (row.id === stringId ? { ...row, name: value } : row))
      );
    };
  
    const handleEdit = (id: number) => {
      alert(`Edit row ${id}`);
    };
  
    const handleDelete = (id: number) => {
      const stringId = id.toString();
      setCustomData((prev) => prev.filter((row) => row.id !== stringId));
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
              {coreData?.map((row) => (
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
                      checked={row.isVisible}
                      onChange={(e) => handleToggleChange(Number(row.id), e.currentTarget.checked)}
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
        <SortableContext items={data.map((d: any) => d.id)} strategy={verticalListSortingStrategy}>
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
              {appData?.map((row) => (<SortableRow key={row.id} row={row} onNameChange={handleAppNameChange} onToggleChange={handleAppToggleChange} />))}
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
            <SortableContext items={data.map((d: any) => d.id)} strategy={verticalListSortingStrategy}>
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
                  {customData?.map((row) => (
                    <ActionTableRow
                      key={row.id}
                      row={row}
                      onNameChange={handleCustomNameChange}
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