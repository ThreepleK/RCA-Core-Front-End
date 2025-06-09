import { useEffect, useState } from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import style from "./content-area.module.css";
import { v4 as uuidv4 } from "uuid";
import { UI_Button, UI_Title } from "@/compos/ui";
import { useEventStore, useLocalSendEvent } from "../../stores";
import type {
  IFetchSidebarMenu,
  IFetchSidebarMenuItem,
} from "../../models";
import { api_getSidebarMenuData } from "../../apis";
import CoreTable from "../core-table/core-table";
import AppTable from "../app-table/app-table";
import CustomTable from "../custom-table/custom-table";

export function ContentArea() {
  const [reloadFlag, setReloadFlag] = useState(false);
  const [data, setData] = useState<IFetchSidebarMenu[]>([]);
  const [coreData, setCoreData] = useState<IFetchSidebarMenuItem[]>([]);
  const [appData, setAppData] = useState<IFetchSidebarMenuItem[]>([]);
  const [customData, setCustomData] = useState<IFetchSidebarMenuItem[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  // const { eKey, eVal, clean } = useLocalSendEvent.getState();
  const { eKey, sendEvent } = useEventStore();


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
    if (!data) return;

    setCoreData(data[0]?.menus);
    setAppData(data[1]?.menus);
    setCustomData(data[2]?.menus);
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
    setCustomData((prev) => [...prev, newRow]);
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
          </div>
        </div>
        <CustomTable dataSource={customData} />
      </div>
    </div>
  );
}

export default ContentArea;
