import { useEffect, useState, type ReactElement } from "react";
import style from "./core-table.module.css";
import { UI_Input, UI_Switch } from "@/compos/ui";
import { useEventStore, useLocalSendEvent } from "../../stores";
import { UI_Table } from "@/compos/ui/ui-table";
import type { IFetchSidebarMenuItem } from "../../models";
import { cloneDeep } from "lodash";

export function CoreTable({
  dataSource,
}: {
  dataSource: IFetchSidebarMenuItem[];
}): ReactElement {
  const [data, setData] = useState<IFetchSidebarMenuItem[]>([]);

//   const { eKey, eVal, clean } = useLocalSendEvent.getState();
  const { eKey, sendEvent } = useEventStore();

  useEffect(() => {
    if (!dataSource) return;
    const clonedData = cloneDeep(dataSource);
    setData(clonedData);
  }, [dataSource]);

  useEffect(() => {
    // cancel 버튼 클릭 시
    if(eKey === "cancel") {
      setData(dataSource);
      sendEvent(null);
    }
  }, [eKey]);

  const handleToggleChange = (id: string, checked: boolean) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, isVisible: checked, itemType: "update" } : row
      )
    );
  };

  const handleDisplayNameChange = (id: string, value: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, displayName: value, itemType: "update" } : row
      )
    );
  };

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
      render: (text, record) => {
        return text === "" ? (
          <UI_Input
            value={text}
            onChange={(e) => {
              handleDisplayNameChange(record.id, text);
            }}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Display",
      dataIndex: "isVisible",
      render: (text, record) => (
        <UI_Switch
          checked={text}
          onChange={(checked) => handleToggleChange(record.id, checked)}
        />
      ),
    },
  ];

  return (
    <UI_Table
      className={style.table}
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}

export default CoreTable;
