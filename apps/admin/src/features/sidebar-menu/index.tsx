import { useEffect, useState } from "react";
import { Button, Flex, Group, Title } from "@mantine/core";
import { ContentArea } from "./components/content-area/content-area";
import { notifications } from '@mantine/notifications';
import style from "./style.module.css";
import { request } from '@/utils/request';

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

const ApplicationMenu = () => {
    const [isCancel, setIsCancel] = useState<boolean>(false);
    const [isApply, setIsApply] = useState<boolean>(false);

    const [data, setData] = useState<IFetchSidebarMenu[]>([]);
    const [coreData, setCoreData] = useState<IFetchSidebarMenuItem[]>([]);
    const [appData, setAppData] = useState<IFetchSidebarMenuItem[]>([]);
    const [customData, setCustomData] = useState<IFetchSidebarMenuItem[]>([]);

    const handleReceiveData = (origin: IFetchSidebarMenu[], core: IFetchSidebarMenuItem[], app: IFetchSidebarMenuItem[], custom: IFetchSidebarMenuItem[]) => {
        setData(origin);
        setCoreData(core);
        setAppData(app);
        setCustomData(custom);
    };
    
    const handleApplyButton = () => {
        const payload = data?.map((item) => {
            if(item.name === 'core_features'){
                item.menus = coreData;
            } else if(item.name === 'app_hub'){
                item.menus = appData;
            } else if(item.name === 'custom_links'){
                item.menus = customData;
            }
            return item;
        });
        
        console.log('payload', payload)
        /*
        * Apply API 호출
        */
        request({type: 'post', url: '/admin/api/menu/sidebar', datas: payload } ).then((res) => {

            if(!res.isErr){
                notifications.show({
                    title: 'Success',
                    message: 'Apply completed successfully',
                    color: 'teal',
                    autoClose: 2000,
                    position: 'top-center', // ⬅️ 중앙에 위치
                  });
                setIsApply(true);
            }
            // setData(res.res)
        });

        
    };

    const handleCancelButton = () => {
        setIsCancel(true);
    };


  return (
    <section className={style.section} style={{'--edit-width': '300px'} as any}>
        <Flex justify='space-between' className={style['title-area']}>
            <Title order={2} className={style.title}>SideBar Menu</Title>
            <Group gap="xs">
                <Button size='xs' variant="default" onClick={() => handleCancelButton()}>Cancel</Button>
                <Button size='xs' onClick={() => handleApplyButton()}>Apply</Button>
            </Group>
        </Flex>
        <ContentArea className={style['cont-area']} isApply={isApply} onChangeApply={setIsApply} isCancel={isCancel} onChangeCancel={setIsCancel} onSendData={handleReceiveData} />
    </section>
);
}

export default ApplicationMenu;