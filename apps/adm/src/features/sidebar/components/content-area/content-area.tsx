import { useEffect, useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import style from './content-area.module.css'
import logo from '../../../../../../host/public/logo.png'
import { UI_Button, UI_Input, UI_Switch, UI_Title } from '@/compos/ui';
import { useLocalSendEvent } from '../../stores';
import { UI_Table } from '@/compos/ui/ui-table';
import type { IFetchSidebarMenu, IFetchSidebarMenuItem, DataType } from '../../models';
import { api_getSidebarMenuData } from '../../apis';
import type { TableColumnsType } from 'antd';

export function ContentArea({ isCancel, onChangeCancel }: {
    isCancel: boolean,
    onChangeCancel: (isCancel: boolean) => void
}){
    const [reloadFlag, setReloadFlag] = useState(false);
    const [data, setData] = useState<IFetchSidebarMenu[]>([]);
    const [coreData, setCoreData] = useState<IFetchSidebarMenuItem[]>([]);
    const [appData, setAppData] = useState<IFetchSidebarMenuItem[]>([]);
    const [customData, setCustomData] = useState<IFetchSidebarMenuItem[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));

     /*
    * 사이드바 메뉴 API 호출
    */
     useEffect(() => {
      api_getSidebarMenuData().then(({ isErr, res }) => {
            if( isErr ){ return; }
            setData(res);
        });
      }, [reloadFlag]);

      // useEffect(() => {
      //   if(isApply) {
      //     setReloadFlag(!reloadFlag);
      //     onChangeApply(false);
      //   }
        
      // }, [isApply]);
  
      useEffect(() => {
        if(!data) return;
        
        setCoreData(data[0]?.menus);
        setAppData(data[1]?.menus);
        setCustomData(data[2]?.menus);
      }, [data]);

      const handleToggleChange = (id: string, checked: boolean) => {
        // const stringId = id.toString();
        setCoreData(prev =>
          prev.map(row => (row.id === id ? { ...row, isVisible: checked, itemType: 'update' } : row))
        );
      };

      const columns: any = [
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Display Name',
          dataIndex: 'displayName',
        },
        {
          title: 'Display',
          dataIndex: 'isVisible',
          render: (text, record) => (
            <UI_Switch
              checked={text}
              onChange={(checked) => handleToggleChange(record.id, checked )}
            />
          ),
        },
      ];

    return <div className={style['cont-area']}>
      <div className={style['core-table']}>
        <UI_Title order={2} className={style.title}>Core Feature</UI_Title>
        <UI_Table className={style.table} columns={columns} dataSource={coreData} pagination={false}/>
      </div>
      <div className={style['core-table']}>
        <UI_Title order={2} className={style.title}>Application Hub</UI_Title>
        <UI_Table className={style.table} columns={columns} dataSource={appData} pagination={false}/>
      </div>
      <div className={style['custom-table']} style={{ marginTop: '20px' }}>
         <div className={style['title-div']}>
         <UI_Title order={2} className={style.title}>Custom Level1</UI_Title>
                <div className={style['button-div']}>
                  <UI_Button >Add level 1 menu</UI_Button>
                  <UI_Button type='primary' >Add level 1 menu</UI_Button>
                </div>
          </div>  
          <UI_Table className={style.table} columns={columns} dataSource={customData} pagination={false}/>
      </div>
    </div>;
  }


export default ContentArea;
