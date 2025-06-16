import React, { useEffect, useState, type ReactElement } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { UI_Input, UI_Select, UI_Switch } from "@/compos/ui";
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
  IFetchLanguageMenuItem,
} from "../../models";
import { IconMenu2 } from "@tabler/icons-react";

const DragHandle = () => (
    <IconMenu2 style={{ cursor: "grab", color: "#999" }} />
);

const DraggableRow = ({ children, ...props }: any) => {
    const rowKey = props["data-row-key"];
    
    if (!rowKey) {
            // row-key가 없으면 기본 <tr> 반환 (예: No Data 상태)
        return <tr {...props}>{children}</tr>;
    }
    
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: rowKey });
    
    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
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

export function SortableTable({
    dataSource,
  }: {
    dataSource?: IFetchLanguageMenuItem[];
  }) {
  
    const [data, setData] = useState<IFetchLanguageMenuItem[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));
    // const { eKey, sendEvent } = useEventStore();
    // const { sendApp } = useDataStore();

    useEffect(() => {
        if (!dataSource) return; 
        
        const clonedData = cloneDeep(dataSource);
        setData(clonedData)
        }, [dataSource])

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

    const options =[
        { value: 'ACTIVE', label: 'ACTIVE' },
        { value: 'INACTIVE', label: 'INACTIVE' },
    ];

    const columns: any = [
        {
            title: "",
            dataIndex: "sort",
            render: (_: any, record: any) => record.sort,
        },
        {
            title: "Language",
            dataIndex: "language",
            width: '25%',
        },
        {
            title: "Code",
            dataIndex: "code",
            width: '25%',
        },
        {
            title: "Default",
            dataIndex: "default",
            width: '25%',
            render: (text, record) => {
                console.log('text', text)
                return text ? 'Default' : <a>Set as default</a>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            width: '25%',
            render: (text, record) => {
                return <UI_Select value={text} options={options} style={{ width: 120 }}/>
            }
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

export default SortableTable;
