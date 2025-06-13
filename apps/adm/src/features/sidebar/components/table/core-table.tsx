import { useEffect, useState, type ReactElement } from "react";
import { UI_Input, UI_Switch } from "@/compos/ui";
import { useDataStore, useEventStore } from "../../stores";
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
    const { sendCore } = useDataStore();
   
    useEffect(() => {
        if (!dataSource) return;
        const clonedData = cloneDeep(dataSource);
        setData(clonedData);
    }, [dataSource]);

    useEffect(() => {
        if (!data) return;
        sendCore(data);
    }, [data]);

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
            width: '23%',
        },
        {
            title: "Display Name",
            dataIndex: "displayName",
            width: '47%',
            render: (text, record) => {
                return <UI_Input
                value={text}
                onChange={(e) => {
                handleDisplayNameChange(record.id, e.currentTarget.value);
                }}
            />
            },
        },
        {
            title: "Display",
            dataIndex: "isVisible",
            width: '30%',
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
        columns={columns}
        dataSource={data}
        pagination={false}
        />
    );
}

export default CoreTable;
