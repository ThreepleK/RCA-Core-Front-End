import { useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  Button,
  Text,
  TextInput,
  Stack,
  Textarea,
  Group,
  ActionIcon,
  Flex,
  Menu,
} from "@mantine/core";
import {
  TreeEditor,
  useTreeStore,
  useRootCtxMenuStore,
  TREE_LIST,
} from "@/compos/ui/tree-editor";
import {
  DB_MENU_ITEM,
  getSelected_treeList,
  getAppList,
  dbRaw2Data,
  data2DbRaw,
  getDeepCp,
} from "./utils";

import style from "./menu-editor.module.css";
import {
  ConfirmModal,
  useConfirmModalStore,
  CreateModal,
  useCreateModalStore,
} from "@/compos/ui/modal";
import { IconDots, IconPlus, IconSearch } from "@tabler/icons-react";
import { useSendAction, useSendSelectedItem } from "../../stores";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";

export function MenuEditor({
  menu,
  onMenuChange,
}: {
  menu: DB_MENU_ITEM[];
  onMenuChange: (changeMenu: DB_MENU_ITEM[]) => void;
}) {
  const menuEditRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const acKey = useSendAction((s) => s.evKey);

  const { setSelectedItem} = useSendSelectedItem(s => s);

  // 메뉴, 앱 메뉴에 필요한 형태로 변환
  const menuList = useMemo(() => dbRaw2Data(menu), [menu]);
  const appList = useMemo(() => getAppList(menuList), [menuList]);

  // 기본 선택 앱 설정
  const [selectApp, setSelectApp] = useState<string | null>(
    appList && appList.length > 0 ? appList[0].value : ""
  );

  const handleRowClick = (item) => {
    console.log('Row clicked:', item);
    setSelectedItem(item)
    // 예: navigate(`/team/${item.id}`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    // 검색 로직 처리 (ex: debounce + API 요청)
  };

  //* 액션버튼
  const onActions = (key: string) => {
    console.log("key", key);
  };

  return (
    <div className={style["menu-editor"]} ref={menuEditRef}>
      {/* 확인 모달 */}
      <ConfirmModal />

      {/* 앱 선택 */}
      <TextInput
        value={query}
        onChange={handleChange}
        placeholder="검색어를 입력하세요"
        leftSection={<IconSearch size={16} />}
        radius="md"
        size="md"
        rightSectionWidth={40}
      />
      <Stack>
        {_TMP_TEAM_DATA?.map((item) => (
          <Group key={item?.id} justify="space-between" style={{
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          className="hover:bg-gray-100" onClick={() => handleRowClick(item)}>
            <Text key={item?.id}>{item?.name}</Text>
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <ActionIcon color="gray" variant="subtle"  >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={(e) => { e.stopPropagation(); alert('Edit!'); }} >Edit Team</Menu.Item>
                <Menu.Item onClick={(e) => { e.stopPropagation(); alert('Manage!'); }}>Manage Team</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {/* </ActionIcon> */}
          </Group>
        ))}
      </Stack>

      {/* 하단 버튼 */}
      <BottomArea onMenuChange={onMenuChange} />
    </div>
  );
}
/**
 * 하단 버튼 처리
 */
function BottomArea({
  onMenuChange,
}: {
  onMenuChange: (changeMenu: DB_MENU_ITEM[]) => void;
}) {
  const sendEvent = useSendAction((s) => s.sendEvent);

  //* 취소
  const onCancel = () => {
    CancelModal("cancel", () => {});
  };

  //* 추가
  const onCreate = () => {
    sendEvent("create");
  };

  return (
    <div className={style["me-bottom"]}>
      <Button
        size="xs"
        radius="md"
        leftSection={<IconPlus size={14} />}
        onClick={onCreate}
      >
        Create team
      </Button>
      {/* <CreateModal /> */}
    </div>
  );
}

/**
 * [모달] 취소
 */
function CancelModal(
  label: string, // 관련 라벨
  callback: () => void // 취소 콜백
) {
  //* 모달
  const { setOpen, setContent } = useConfirmModalStore.getState();

  // 취소 모달
  setContent(
    <Text size="md" fw={500} c="red">
      Cancel menu edit
    </Text>,
    <Text size="sm">
      Do you want to cancel the <b>{label}</b> menu you are editing?
    </Text>,
    "Confirm",
    callback
  );
  setOpen(true);
}

// 그리드 임시 데이터
const _TMP_TEAM_DATA = [
  {
    id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
    name: "BL",
    createTime: "2025-05-23 15:47:00",
  },
  {
    id: "1323addd-a4ac-4dd1-8de2-6f934969a0f2",
    name: "DA",
    createTime: "2025-05-23 15:49:00",
  },
  {
    id: "2343addd-a4ac-4dd1-8de2-6f934969a0f2",
    name: "SD",
    createTime: "2025-05-23 16:24:00",
  },
];

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
  { key: "edit", label: "Edit Team" },
  { key: "manage", label: "Manage Team" },
];
