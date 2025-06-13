import React, { useEffect, useState, type ReactElement } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { UI_Button, UI_Input, UI_Switch } from "@/compos/ui";
import { useDataStore, useEventStore } from "../../stores";
import { UI_Table } from "@/compos/ui/ui-table";
import { cloneDeep } from "lodash";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IFetchSidebarMenuItem } from "../../models";
import { useCommModalStore } from "@/compos/modal";
import EditCustomModal from "../modal-content/edit-custom-modal";
import { IconMenu2, IconTrash } from "@tabler/icons-react";

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

export function CustomTable({
  dataSource,
  addLevelData,
}: {
  dataSource: IFetchSidebarMenuItem[];
  addLevelData: IFetchSidebarMenuItem[];
}) {
    const [data, setData] = useState<IFetchSidebarMenuItem[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));
    const { eKey, sendEvent } = useEventStore();
    const { sendCustom } = useDataStore();

    useEffect(() => {
        if (!dataSource) return;
        const clonedData = cloneDeep(addLevelData);
        setData(clonedData);
    }, [addLevelData]);

    useEffect(() => {
        if (!data) return;
        sendCustom(data);
    }, [data]);

    useEffect(() => {
        // cancel 버튼 클릭 시
        if (eKey === "cancel") {
        setData(dataSource);
        sendEvent(null);
        }
    }, [eKey]);

    const handleToggleChange = (id: string, checked: boolean) => {
        // const stringId = id.toString();
        setData((prev) =>
        prev.map((row) =>
            row.id === id ? { ...row, isVisible: checked, itemType: "update" } : row
        )
        );
    };

    const handleDisplayNameChange = (id: string, value: string, rowData: any) => {
        if (rowData.itemType === "new") {
        const name = value.replace(/\s+/g, "_").toLowerCase(); // 공백을 '-'로 변환
        setData((prev) =>
            prev.map((row) =>
            row.id === id
                ? { ...row, name: name, displayName: value, itemType: "new" }
                : row
            )
        );
        } else {
        setData((prev) =>
            prev.map((row) =>
            row.id === id
                ? { ...row, displayName: value, itemType: "update" }
                : row
            )
        );
        }
    };

    const handleCustomNameChange = (id: string, value: string, rowData: any) => {
        if (rowData.itemType === "new") {
        const name = value.replace(/\s+/g, "_").toLowerCase(); // 공백을 '-'로 변환
        setData((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, name: name, itemType: "new" } : row
            )
        );
        }
    };

    const handleEdit = (record: any) => {
        editCustomLink(record);
    };

    const handleDelete = (id: string) => {
        setData((prev) => prev.filter((row) => row.id !== id));
        sendCustom(data);
    };

    const columns: any = [
        {
            title: "",
            dataIndex: "sort",
            width: 10,
            render: (_: any, record: any) => record.sort,
        },
        {
            title: "Name",
            dataIndex: "name",
            width: '20%',
            render: (text, record) => {
                return text === "" ? (
                <UI_Input
                    value={text}
                    onChange={(e) => {
                    handleCustomNameChange(record.id, e.currentTarget.value, record);
                    }}
                />
                ) : (
                text
                );
            },
        },
        {
            title: "Display Name",
            dataIndex: "displayName",
            width: '25%',
            render: (text, record) => {
                return (
                <UI_Input
                    value={text}
                    onChange={(e) => {
                    handleDisplayNameChange(record.id, e.currentTarget.value, record);
                    }}
                />
                );
            },
        },
        {
            title: "URL",
            dataIndex: "url",
            width: '25%',
            render: (text, record) => {
                return (
                <UI_Input
                    value={text}
                    onChange={(e) => {
                    handleDisplayNameChange(record.id, e.currentTarget.value, record);
                    }}
                />
                );
            },
        },
        {
            title: "Display",
            width: '15%',
            dataIndex: "isVisible",
            render: (text, record) => (
                <UI_Switch
                checked={text}
                onChange={(checked) => handleToggleChange(record.id, checked)}
                />
            ),
        },
        {
            title: "Actions",
            key: "action",
            width: '15%',
            render: (_, record) => (
                <IconTrash size={20} strokeWidth={1.5} title='Delete' onClick={() => handleDelete(record.id)} />
            ),
        },
    ];

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

export default CustomTable;

/**
 * custom link 편집 모달
 * @returns {void}
 */
export function editCustomLink(row: any){
    const {setContent, setOpen} = useCommModalStore.getState();

    setContent({
        title: 'Edit custom menu information',
        content: <EditCustomModal row={row} type='mod'/>,
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