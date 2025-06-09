import React, { useEffect, useState, type ReactElement } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import style from "./app-table.module.css";
import { UI_Input, UI_Switch } from "@/compos/ui";
import { useEventStore, useLocalSendEvent } from "../../stores";
import { UI_Table } from "@/compos/ui/ui-table";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cloneDeep } from "lodash";
import { CSS } from "@dnd-kit/utilities";
import { MenuOutlined } from "@ant-design/icons";
import type {
  IFetchSidebarMenuItem,
} from "../../models";

const DragHandle = () => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
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
      width: 40,
      render: (_: any, record: any) => record.sort,
    },
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
              className={style.table}
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
