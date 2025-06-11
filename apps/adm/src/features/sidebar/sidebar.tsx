import { useEffect, useState } from "react";
import { useStore } from "zustand";

import { ContentsLayout, useContsLayoutStore } from "@/compos/layout";
import { UI_Flex, UI_Button, UI_Input } from "@/compos/ui";

import ContentArea from "./components/content-area/content-area";
import style from "./sidebar.module.css";
import { useDataStore, useEventStore } from "./stores";
import { IconPlus } from "@tabler/icons-react";
import { api_setSidebarMenuData } from "./apis";
import { useCommModalStore } from "@/compos/modal";
import AddLicenseModal from "./components/modal-content/add-license-modal";

export function Sidebar() {

  return (
    <>
      {/* 페이지 내 Action을 주고 받기 위한 SendActionProvider 추가 */}
      <ContentsLayout>
        {/* 초기 레이아웃 설정 */}
        <InitLayout />
        {/* 컨텐츠 */}
        <ContentArea />
      </ContentsLayout>
    </>
  );
}

/**
 * 초기 레이아웃 설정
 */
function InitLayout() {
  const contLayout = useContsLayoutStore();

  //-- 컨텐츠 설정
  const setTitleLeft = useStore(contLayout, (s) => s.setTitleLeft);
  const setTitleRight = useStore(contLayout, (s) => s.setTitleRight);
  const setContClass = useStore(contLayout, (s) => s.setContClass);

  //* 초기 설정
  useEffect(() => {
    // 타이틀 설정
    setTitleLeft("Sidebar");
    setTitleRight(<TitleRightSide />);

    // 본문 클래스 설정
    setContClass(style.content);
  }, []);

  return <></>;
}

/**
 * 타이틀 우측
 */
function TitleRightSide() {
  // 이벤트 가져오기
  const [visible, setVisible] = useState(false);
  const { sendEvent } = useEventStore();
  const { data, core, app, custom } = useDataStore();

  const showToast = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 2000); // 2초 후 자동 사라짐
  };

  //* 저장
  const handleApplyButton = () => {
    const payload: any = data?.map((item) => {
      if (item.name === "core_features") {
        item.menus = core;
      } else if (item.name === "app_hub") {
        item.menus = app;
      } else if (item.name === "custom_links") {
        item.menus = custom;
      }
      return item;
    });
    /*
     * Apply API 호출
     */
    api_setSidebarMenuData(payload).then(({isErr}) => {
        if( isErr ){ return; }
        // 저장 성공 팝업
        showToast();
        sendEvent('save');
    });
  };

  //* 취소
  const onCancel = () => {
    sendEvent("cancel");
  };

  //* 생성  
  const onCreate = () => {
    // sendEvent("create");
    AddLicense();
  };

  return (
    <UI_Flex
      justify="flex-end"
      align="center"
      gap="small"
      className={style["top-right"]}
    >
      <UI_Button
        icon={<IconPlus size={14} />}
        iconPosition="start"
        onClick={onCreate}
        type="primary"
      >
        Add license
      </UI_Button>
      <UI_Button onClick={onCancel}>Cancel</UI_Button>
      <UI_Button onClick={handleApplyButton} type="primary">
        Save
      </UI_Button>

      {visible && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#38a169", // green.500
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          Apply completed successfully !
        </div>
      )}
    </UI_Flex>
  );
}

/**
 * custom link 편집 모달
 * @returns {void}
 */
export function AddLicense(){
    const {setContent, setOpen} = useCommModalStore.getState();

    setContent({
        title: 'Add license',
        content: <AddLicenseModal type='mod' />,
        buttons: {
            'cancel': <UI_Button>Cancel</UI_Button>,
            'add': <UI_Button type='primary'>Next</UI_Button>,
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