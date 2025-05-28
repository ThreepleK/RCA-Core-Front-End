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
import { createSendAction, useGlobalSendAction } from "../../stores";
import { ReactNode, useEffect, useState } from "react";
import { useContsLayoutStore } from "@/compos/layout";
import { useStore } from "zustand";

// 우측 상단 버튼 제어용
const _useBtnActions = createSendAction();


export function ContentArea() {
  // const sendEvent = useSendAction((s) => s.sendEvent);
  // const [tabKey, setTabKey] = useState<any>(_TAB_CONTS[0].key);
  const sendEvent = useGlobalSendAction(s => s.sendEvent);
  const tabKey = _useBtnActions(s => s.evKey);

  return <>
        {/* 컨텐츠 초기 설정 */}
        <InitCont />

        {/* 선택 된 탭 표기 */}
        {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
            const active = item.key === tabKey ? 'on-active' : '';

            return (
                <div className={`${style['tab-cont']} ${active}`} key={idx}>
                    {item.comp}
                </div>
            );
        })}
    </>;
}

/**
 * 초기 설정
 */
function InitCont(){
    const contLayout = useContsLayoutStore();
        
    //-- 컨텐츠 설정
    const setTitleRight = useStore(contLayout, s => s.setTitleRight);

    useEffect(() => {
        setTitleRight(<TitleRight />);
    }, []);

    return <></>;
}

/**
 * 우측 타이틀 설정
 */
function TitleRight(){
  const [tab, setTab] = useState(_TAB_CONTS[0].key);
  const sendEvent = _useBtnActions(s => s.sendEvent);

  useEffect(() => {
      sendEvent(tab);
  }, [tab]);

  return <>
      <div className={style['title-right']}>
          <div className={style['tr-left']}>
              <Tabs variant="default" inverted value={tab} onChange={setTab} className={style['tab-list']}>
                  {/* 탭 목록 */}
                  <Tabs.List>
                      {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                          return <Tabs.Tab key={idx} value={item.key} leftSection={item.icon}>{item.label}</Tabs.Tab>
                      })}
                  </Tabs.List>
              </Tabs>
          </div>
          <div className={style['tr-right']}>
              {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                  const active = item.key === tab ? 'on-active' : '';
                  return <div className={`${active}`} key={idx}>{item.buttons}</div>;
              })}
          </div>
      </div>
  </>;
}

/**
 * 권한 버튼 이벤트
 */
function PermissionButtons(){
    // const sendEvent = useGlobalSendAction(s => s.sendEvent);
    const sendEvent = useGlobalSendAction(s => s.sendEvent);

    //* 추가
    const onCreate = () => {
        sendEvent('add-member');
    };

    //* 액션버튼
    const onActions = (key: string) => {
      sendEvent(`selected-${key}`);
    };

    return (
        <Flex justify='flex-end' gap='xs'>
            <DropdownMenu label='Actions' menuList={_ACTION_MENUS} onActions={onActions} />
            <Button size="xs" radius="md"
                leftSection={<IconPlus size={14} />}
                onClick={onCreate}
            >Add members</Button>
        </Flex>
    );
}

type TabItem = {
  label: string; // 탭 라벨
  key: string; // 탭 & 본문 연결 키 값
  comp: any; // 탭 본문 컴포넌트
  icon?: any; // 탭 라벨 좌측에 들어갈 아이콘
  buttons?: ReactNode;     // 탭 관련 버튼
};

// 탭 
const _TAB_CONTS: TabItem[] = [
    {
        label: 'Members', key: 'members',
        comp: <Members />,
        buttons: <PermissionButtons />,
        icon: <IconInfoSquareRounded size={15} strokeWidth={1.25} />
    },
    {
        label: 'Settings', key: 'settings',
        comp: <Settings />,
        icon: <IconLicense size={15} strokeWidth={1.25} />
    },
];

//* Actions 드랍다운 메뉴
const _ACTION_MENUS = [
  { key: "deactive", label: "Deactive member" },
  { key: "delete", label: "Delete member" },
];
