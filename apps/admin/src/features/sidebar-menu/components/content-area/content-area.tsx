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
import { v4 as uuidv4 } from 'uuid'
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
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
  applicationId?: string;
  licenseId?: string;
  menuGroupId?: string;
  itemType?: string;
}

export function ContentArea({ className, isCancel, onChangeCancel, onSendData }: {
    className: string,
    isCancel: boolean,
    onChangeCancel: (isCancel: boolean) => void,
    onSendData: (data: IFetchSidebarMenu[], coreData: IFetchSidebarMenuItem[], appData: IFetchSidebarMenuItem[], customData: IFetchSidebarMenuItem[] ) => void;
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

    useEffect(() => {
      if(isCancel) {
        setCoreData(data[0]?.menus);
        setAppData(data[1]?.menus);
        setCustomData(data[2]?.menus);

        onChangeCancel(false);
      }
    }, [isCancel]);
    
    useEffect(() => {
      onSendData(data, coreData, appData, customData);
    }, [coreData, appData, customData]);

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
        // setAppData((items) => arrayMove(items, oldIndex, newIndex));  
        const newData = arrayMove(appData, oldIndex, newIndex);
        const updatedData = newData.map((item, index) => ({
          ...item,
          sortOrder: index + 1, // 1부터 시작
        }));
        setAppData(updatedData);
      }
    };
  
    const handleCustomDragEnd = (event: any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = customData.findIndex((item) => item.id === active.id);
        const newIndex = customData.findIndex((item) => item.id === over?.id);
        const newData = arrayMove(customData, oldIndex, newIndex);
        // setCustomData((items) => arrayMove(items, oldIndex, newIndex));
        const updatedData = newData.map((item, index) => ({
          ...item,
          sortOrder: index + 1, // 1부터 시작
        }));
        setCustomData(updatedData);
      }
    };
  
    const handleToggleChange = (id: string, checked: boolean) => {
      // const stringId = id.toString();
      setCoreData(prev =>
        prev.map(row => (row.id === id ? { ...row, isVisible: checked, itemType: 'update' } : row))
      );
    };

    const handleAppToggleChange = (id: string, checked: boolean) => {
      // const stringId = id.toString();
      setAppData(prev =>
        prev.map(row => (row.id === id ? { ...row, isVisible: checked, itemType: 'update' } : row))
      );
    };

    const handleAppNameChange = (id: string, value: string) => {
      // const stringId = id.toString();
      setAppData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, displayName: value, itemType: 'update' } : row))
      );
    };

    const handleCustomNameChange = (id: string, value: string, rowData: any) => {
      if(rowData.itemType === 'new') {
        const name = value.replace(/\s+/g, '_').toLowerCase(); // 공백을 '-'로 변환
        setCustomData((prev) =>
          prev.map((row) => (row.id === id ? { ...row, name: name, displayName: value, itemType: 'new' } : row))); 
      } else {
        setCustomData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, displayName: value, itemType: 'update' } : row))); 
      }
    }

    const handleCustomUrlChange = (id: string, value: string) => {
      setCustomData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, url: value, itemType: 'update' } : row))); 
    };
  
    const handleEdit = (id: string) => {
      alert(`Edit row ${id}`);
    };
  
    const handleDelete = (id: string) => {
      setCustomData((prev) => prev.filter((row) => row.id !== id)); 
    };

    const handleAddLevel = () => {
      const newRow = {
        id: uuidv4(), // 고유 id (간단한 예시)
        name: '',
        displayName: '',
        url: '',
        level: 1,
        sortOrder: 0,
        isVisible: true,
        licenseId: '2',
        openInNewTab: false,
        menuGroupId: '3', // 메뉴 그룹 ID (나중에 빠질 내용)
        itemType: 'new'
      };
      setCustomData((prev) => [...prev, newRow]);
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
          <button className={style['add-button']} onClick={() => handleAddLevel()}>
            Add level 1 menu
          </button>
          {/* <button className={style['add-button']}>
            Add custom link
          </button> */}
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
                  <Table.Th className={style.row}>Display Name</Table.Th>
                  <Table.Th className={style.row}>URL</Table.Th>
                  <Table.Th className={style.row}>Action</Table.Th>
                </tr>
                </Table.Thead>
                <Table.Tbody>
                  {customData?.map((row) => (
                    <ActionTableRow
                      key={row.id}
                      row={row}
                      onNameChange={handleCustomNameChange}
                      onUrlChange={handleCustomUrlChange}
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