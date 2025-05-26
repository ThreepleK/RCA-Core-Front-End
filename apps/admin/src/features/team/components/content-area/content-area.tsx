import { Button, Flex, Group, Tabs, Title } from "@mantine/core";

import {
  IconInfoSquareRounded,
  IconLicense,
  IconPlus,
} from "@tabler/icons-react";

import style from "./content-area.module.css";
import { Members } from "./members";
import { Settings } from "./settings";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";
import { useSendAction } from "../../stores";

export function ContentArea() {
  const sendEvent = useSendAction((s) => s.sendEvent);
  //* 추가
  const onCreate = () => {
    sendEvent("create");
  };

  //* 액션버튼
  const onActions = (key: string) => {
    sendEvent(`selected-${key}`);
  };

  return (
    <>
      <Tabs variant="default" defaultValue={_TAB_CONTS[0].key}>
        <Tabs.List className={style["tab-list"]}>
          {_TAB_CONTS.map((item, idx) => (
            <Tabs.Tab key={idx} value={item.key} leftSection={item.icon}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {/* 탭 본문 */}
        {_TAB_CONTS.map((item, idx) => (
          <Tabs.Panel className={style["tab-cont"]} key={idx} value={item.key}>
            {item.comp}
          </Tabs.Panel>
        ))}
      </Tabs>
      <Flex justify="flex-end" gap="xs" style={{ marginTop: "5px" }}>
        <DropdownMenu
          label="Actions"
          menuList={_ACTION_MENUS}
          onActions={onActions}
        />
        <Button
          size="xs"
          radius="md"
          leftSection={<IconPlus size={14} />}
          onClick={onCreate}
        >
          Add member
        </Button>
      </Flex>
    </>
  );
}

type TabItem = {
  label: string; // 탭 라벨
  key: string; // 탭 & 본문 연결 키 값
  comp: any; // 탭 본문 컴포넌트
  icon?: any; // 탭 라벨 좌측에 들어갈 아이콘
};

// 탭
const _TAB_CONTS: TabItem[] = [
  { label: "Members", key: "members", comp: <Members /> },
  { label: "Settings", key: "settings", comp: <Settings /> },
];

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
  { key: "deactive", label: "Deactive member" },
  { key: "delete", label: "Delete member" },
];
