import { columnFilters, DataGrid } from "@/compos/ui/data-grid";
import { Tabs } from "@mantine/core";
import { MRT_ColumnDef, MRT_TableOptions } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import style from "./member-grid.module.css";
import { useSelectedRowStore } from "../content-area/content-area-store";

export function MemberGrid() {
  const { deletedData, isClear, setClear } = useSelectedRowStore();
  const [selectedRow, setSelectedRow] = useState<{ [key: string]: boolean }>({});
  
  //* 그리드 row 선택
  const selectedRowsData = useMemo(() => {
    return _TMP_DATA?.filter((row) => selectedRow[row?.id]);
  }, [selectedRow]);

  useEffect(() => {
    onChangeRowSelection(selectedRowsData)
  }, [selectedRowsData]);

  useEffect(() => {
    if(deletedData === null) return;
    // deletedData가 변경될 때마다 선택 상태를 업데이트
    const selectionState = deletedData.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setSelectedRow(selectionState); 
  }, [deletedData]);

  useEffect(() => {
    if (isClear) {
      setSelectedRow({}); 
      setClear(false);
    }
  }, [isClear]);

       
//* 그리드 추가 옵션
    const opts = useMemo(() => ({
      getRowId: (row: any) => row.id,
      enableRowSelection: true,
      onRowSelectionChange: setSelectedRow,
      state: { rowSelection: selectedRow },
    }), [selectedRow]);
  
    // Action 컬럼을 추가
    const columns: COLUMN_ITEM[] = useMemo(() => [
        ..._COLUMNS,
    ], [_COLUMNS]);
  
  return (
   <div className={style['hull-height']}>
    <Tabs defaultValue="user">
      <Tabs.List>
        <Tabs.Tab value="user">
          User
        </Tabs.Tab>
        <Tabs.Tab value="organization">
          Organization
        </Tabs.Tab>
        <Tabs.Tab value="user-group" >
          User Group
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="user">
        <DataGrid columns={columns} data={_TMP_DATA} opts={opts as any} />
      </Tabs.Panel>

      <Tabs.Panel value="organization">
        organization tab content
      </Tabs.Panel>

      <Tabs.Panel value="user-group">
        user-group tab content
      </Tabs.Panel>
    </Tabs>
      
    </div>
      
  );
}

type COLUMN_ITEM = MRT_ColumnDef<any>;

//* 자동완성 필터
const _BASIC_FILTER = columnFilters.text({
});

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = [
    { accessorKey: "name", header: "Name", ..._BASIC_FILTER },
    { accessorKey: "email", header: "Email" , ..._BASIC_FILTER},
];

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "admin",
        email: "test@gmail.com",
    },
    {
        id: "1345addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "yunny",
        email: "yunny@gmail.com",
    },
    {
        id: "1375addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "ella",
        email: "ella@gmail.com",
    },
    {
        id: "1393addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "haley",
        email: "haley@gmail.com",
    },
    {
        id: "1303addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "tk",
        email: "tk@gmail.com",
    },
];

/**
 *  체크박스 선택
 */
function onChangeRowSelection(
    data: any, // 관련 라벨
    callback?: () => void // 확인 콜백
  ) {
        const { setSelectedRow } = useSelectedRowStore.getState();
        setSelectedRow(data);
  }