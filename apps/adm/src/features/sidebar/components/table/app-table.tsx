import React, { useEffect, useState, type ReactElement } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { UI_Input, UI_Switch } from "@/compos/ui";
import { useDataStore, useEventStore } from "../../stores";
import { UI_Table } from "@/compos/ui/ui-table";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cloneDeep } from "lodash";
import { CSS } from "@dnd-kit/utilities";
import type {
  IFetchSidebarMenuItem,
} from "../../models";
import { IconMenu2 } from "@tabler/icons-react";

    const DragHandle = () => (
        <IconMenu2 style={{ cursor: "grab", color: "#999" }} />
    );

const DraggableRow = ({ children, ...props }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: props["data-row-key"] });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform),
        transition,
    };

  // toArray를 사용해 ReactNode → ReactElement[]로 변환
    const childrenArray = React.Children.toArray(children) as ReactElement[];

    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {childrenArray.map((child, index) => {
            if (index === 0 && React.isValidElement(child)) {
            const childTyped = child as React.ReactElement<any>;

            return React.cloneElement(childTyped, {
                ...childTyped.props,
                children: (
                <span
                    {...listeners}
                    style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    }}
                >
                    <DragHandle />
                    {childTyped.props.children}
                </span>
                ),
            });
            }
            return child;
        })}
        </tr>
    );
};

export function AppTable({
    dataSource,
  }: {
    dataSource: IFetchSidebarMenuItem[];
  }) {
  
    const [data, setData] = useState<IFetchSidebarMenuItem[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));
    const { eKey, sendEvent } = useEventStore();
    const { sendApp } = useDataStore();

    useEffect(() => {
        if (!dataSource) return;
        const clonedData = cloneDeep(dataSource);
        setData(clonedData);
        }, [dataSource]);

        useEffect(() => {
        if (!data) return;
        sendApp(data);
        }, [data]);

    useEffect(() => {
        // cancel 버튼 클릭 시
        if(eKey === "cancel") {
            setData(dataSource);
            sendEvent(null);
        }
        }, [eKey]);

    const handleToggleChange = (id: string, checked: boolean) => {
        // const stringId = id.toString();
        setData((prev) =>
            prev.map((row) =>
                row.id === id
                    ? { ...row, isVisible: checked, itemType: "update" }
                    : row
                )
        );
    };

    const handleDisplayNameChange = (
        id: string,
        value: string,
    ) => {
        setData((prev) =>
            prev.map((row) =>
                row.id === id
                    ? { ...row, displayName: value, itemType: "update" }
                    : row
                )
        );
    };

    const columns: any = [
        {
            title: "",
            dataIndex: "sort",
            render: (_: any, record: any) => record.sort,
        },
        {
            title: "Name",
            dataIndex: "name",
            width: '20%',
        },
        {
            title: "Display Name",
            dataIndex: "displayName",
            width: '50%',
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
                onChange={(checked) =>
                    handleToggleChange(record.id, checked)
                }
                />
            ),
        },
    ]

    const handleAppDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = data.findIndex((item) => item.id === active.id);
            const newIndex = data.findIndex((item) => item.id === over?.id);
            const newData = arrayMove(data, oldIndex, newIndex);
            // setCustomData((items) => arrayMove(items, oldIndex, newIndex));
            const updatedData = newData.map((item, index) => ({
                ...item,
                sortOrder: index + 1, // 1부터 시작
        }));
        setData(updatedData);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleAppDragEnd}
            >
                <SortableContext
                items={data.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                    <UI_Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                    components={{
                        body: {
                        row: DraggableRow,
                        },
                    }}
                    />
                </SortableContext>
        </DndContext>
    );
}

export default AppTable;
