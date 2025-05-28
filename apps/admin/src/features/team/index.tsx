import { useStore } from "zustand";
import { useEffect, useMemo, useState } from "react";
import { ContentsLayout, useContsLayoutStore } from "@/compos/layout";
import { MenuEditor } from "./components/menu-editor";
import { ContentArea } from "./components/content-area";

import { api_getMenuData, api_setMenuData } from './apis'
import { TreeProvider } from "@/compos/ui/tree-editor";
import { LoadingOverlay } from "@mantine/core";

import style from './style.module.css'

const Team = () => {
    return <>
        <ContentsLayout CtxProvider={TreeProvider}>
            {/* 초기 레이아웃 설정 */}
            <InitLayout />
            {/* 컨텐츠 */}
            <ContentArea />
        </ContentsLayout>
    </>;
}

/**
 * 초기 레이아웃 설정
 */
function InitLayout(){
    const contLayout = useContsLayoutStore();
    
    //-- 컨텐츠 설정
    const setTitleLeft = useStore(contLayout, s => s.setTitleLeft);
    const setSideArea = useStore(contLayout, s => s.setSideArea);

    //* 초기 설정
    useEffect(() => {
        // 타이틀 설정
        setTitleLeft('Team');

        // 사이드 영역 설정
        setSideArea('300px', <SideArea />);
    }, []);

    return <></>;
}

/**
 * 사이드 영역
 */
function SideArea(){
    const [reloadFlag, setReloadFlag] = useState(false);
    const [menuData, setMenuData] = useState<any[]|null>(null);

    //* 로딩 여부
    const isLoading = useMemo(() => (menuData === null), [menuData]);

    //* 메뉴 데이터 가져오기
    useEffect(() => {
        api_getMenuData().then(({ isErr, res }) => {
            if( isErr ){ return; }
            setMenuData(res);
        });
    }, [reloadFlag]);

    //* 메뉴 변경 처리
    const onMenuChange = (data: any[]) => {
        // 변경된 메뉴랑 원본 메뉴량 합치기
        // const result = dbRawContainData(data, menuData);
        // // 저장 요청
        // api_setMenuData(result).then(({isErr}) => {
        //     // 데이터 초기화
        //     setMenuData(null);
        //     // 변경된 데이터로 새로 불러오기
        //     setReloadFlag(!reloadFlag);
        // });
    };

    return <>{isLoading
        ? <div className={style['side-area-loading']}>
            <LoadingOverlay visible={true} zIndex={1000} />
        </div>
        : <MenuEditor menu={menuData} onMenuChange={onMenuChange} />
    }</>
}

export default Team;