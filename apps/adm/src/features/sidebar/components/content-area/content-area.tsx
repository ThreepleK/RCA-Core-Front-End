import { useEffect, useState } from "react";
import style from "./content-area.module.css";
import { v4 as uuidv4 } from "uuid";
import { UI_Button, UI_Input, UI_Title } from "@/compos/ui";
import { useDataStore, useEventStore } from "../../stores";
import type { IFetchSidebarMenu, IFetchSidebarMenuItem } from "../../models";
import { api_getSidebarMenuData } from "../../apis";
import CoreTable from "../table/core-table";
import AppTable from "../table/app-table";
import CustomTable from "../table/custom-table";
import { CommModal, useCommModalStore } from "@/compos/modal";

export function ContentArea() {
  const [reloadFlag, setReloadFlag] = useState(false);
  const [data, setData] = useState<IFetchSidebarMenu[]>([]);
  const [coreData, setCoreData] = useState<IFetchSidebarMenuItem[]>([]);
  const [appData, setAppData] = useState<IFetchSidebarMenuItem[]>([]);
  const [customData, setCustomData] = useState<IFetchSidebarMenuItem[]>([]);
  const [addCustomData, setAddCustomData] = useState<IFetchSidebarMenuItem[]>([]);
  // const [isOpen, setIsOpen] = useState(false);

  // const { eKey, eVal, clean } = useLocalSendEvent.getState();
  const { eKey, sendEvent } = useEventStore();
  const { sendData } = useDataStore();

  const { setOpen, setContent } = useCommModalStore((s) => s);

  /*
   * 사이드바 메뉴 API 호출
   */
  useEffect(() => {
    api_getSidebarMenuData().then(({ isErr, res }) => {
      if (isErr) {
        return;
      }
      setData(res);
    });
  }, [reloadFlag]);

  useEffect(() => {
    if (eKey === "save") {
      setReloadFlag(!reloadFlag);
    }
  }, [eKey]);

  useEffect(() => {
    if (!data) return;

    setCoreData(data[0]?.menus);
    setAppData(data[1]?.menus);
    setCustomData(data[2]?.menus);
    setAddCustomData(data[2]?.menus);

    sendData(data);
  }, [data]);

  const handleAddLevel = () => {
    const newSortOrder = customData?.length;
    const newRow = {
      id: uuidv4(), // 고유 id (간단한 예시)
      name: "",
      displayName: "",
      url: "",
      level: 1,
      sortOrder: newSortOrder + 1,
      isVisible: true,
      isActive: true,
      licenseId: "2",
      openInNewTab: false,
      menuGroupId: "3", // 메뉴 그룹 ID (나중에 빠질 내용)
      itemType: "new",
    };
    setAddCustomData((prev) => [...prev, newRow]);
  };

  const handleAddCustomLink = () => {
    // setOpen(true);
    AddCustomLink();
  };

  return (
    <div className={style["cont-area"]}>
      <div className={style["core-table"]}>
        <UI_Title order={2} className={style.title}>
          Core Feature
        </UI_Title>
        <CoreTable dataSource={coreData} />
      </div>
      <div className={style["core-table"]}>
        <UI_Title order={2} className={style.title}>
          Application Hub
        </UI_Title>
        <AppTable dataSource={appData} />
      </div>
      <div className={style["custom-table"]} style={{ marginTop: "20px" }}>
        <div className={style["title-div"]}>
          <UI_Title order={2} className={style.title}>
            Custom Level1
          </UI_Title>
          <div className={style["button-div"]}>
            <UI_Button onClick={handleAddLevel}>Add level 1 menu</UI_Button>
            <UI_Button type="primary" onClick={handleAddCustomLink}>Add custom link</UI_Button>
          </div>
        </div>
        <CustomTable dataSource={customData} addLevelData={addCustomData} />
        <CommModal />
      </div>
    </div>
  );
}

export default ContentArea;

/**
 * custom link 편집 모달
 * @returns {void}
 */
export function AddCustomLink(){
    const {setContent, setOpen} = useCommModalStore.getState();

    setContent({
        title: 'Add custom link',
        content: <UI_Input />,
        buttons: {
            'cancel': <UI_Button>Cancel</UI_Button>,
            'add': <UI_Button type='primary'>OK</UI_Button>,
        },
        feedback: (key: string) => {
            // 닫기
            if( key === 'cancel' ){
                setOpen(false);
                return;
            }
        },
        size: 'lg'
    });

    setOpen(true);
}