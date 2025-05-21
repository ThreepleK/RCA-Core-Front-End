import { useState } from "react";
import { Button, Group } from "@mantine/core";
import { ContentArea } from "./components/content-area/content-area";
import { api_setSidebarMenuData } from "./apis";
import { ContentsLayout } from "@/compos/layout";

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

const SideBarMenu = () => {
    const [isCancel, setIsCancel] = useState<boolean>(false);
    const [isApply, setIsApply] = useState<boolean>(false);

    const [data, setData] = useState<IFetchSidebarMenu[]>([]);
    const [coreData, setCoreData] = useState<IFetchSidebarMenuItem[]>([]);
    const [appData, setAppData] = useState<IFetchSidebarMenuItem[]>([]);
    const [customData, setCustomData] = useState<IFetchSidebarMenuItem[]>([]);
    const [visible, setVisible] = useState(false);

    const showToast = () => {
        setVisible(true);
        setTimeout(() => setVisible(false), 2000); // 2초 후 자동 사라짐
    };

    const handleReceiveData = (origin: IFetchSidebarMenu[], core: IFetchSidebarMenuItem[], app: IFetchSidebarMenuItem[], custom: IFetchSidebarMenuItem[]) => {
        setData(origin);
        setCoreData(core);
        setAppData(app);
        setCustomData(custom);
    };
    
    const handleApplyButton = () => {
        const payload: any = data?.map((item) => {
            if(item.name === 'core_features'){
                item.menus = coreData;
            } else if(item.name === 'app_hub'){
                item.menus = appData;
            } else if(item.name === 'custom_links'){
                item.menus = customData;
            }
            return item;
        });
        
        /*
        * Apply API 호출
        */
        api_setSidebarMenuData(payload).then(({isErr}) => {
            if( isErr ){ return; }
            // 저장 성공 팝업
            showToast();
            setIsApply(true); 
        });
    };

    const handleCancelButton = () => {
        setIsCancel(true);
    };

  return (
    <ContentsLayout
        title={<>SideBar Menu</>}
        titleRightSide={<>
          <Group gap="xs">
              <Button size='xs' variant="default" onClick={() => handleCancelButton()}>Cancel</Button>
              <Button size='xs' onClick={() => handleApplyButton()}>Apply</Button>
          </Group>
        </>}
    >
        <ContentArea isApply={isApply} onChangeApply={setIsApply} isCancel={isCancel} onChangeCancel={setIsCancel} onSendData={handleReceiveData} />
        {visible && (
            <div style={{
                position: 'fixed',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#38a169', // green.500
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                zIndex: 9999,
            }}>
            Apply completed successfully !
            </div>
        )}
    </ContentsLayout>
  );
}

export default SideBarMenu;