import { useEffect, useMemo, useState } from "react";
import { Button, Flex, LoadingOverlay } from "@mantine/core";
import { ContentsLayout } from "@/compos/layout";

import { api_getMenuData, api_setMenuData } from './apis'
import { MenuEditor } from "./components/menu-editor";

import style from './style.module.css'
import { Grid } from "./components/grid";
import { DropdownMenu } from "@/compos/ui/dropdown-menu";
import { IconPlus } from "@tabler/icons-react";
import { useSendAction } from "./stores";
import { ContentArea } from "./components/content-area";

const Team = () => {
    const [reloadFlag, setReloadFlag] = useState(false);
    const [menuData, setMenuData] = useState<any[]|null>(null);

    //* 로딩 여부
    const isLoading = useMemo(() => (menuData === null), [menuData]);

    const sendEvent = useSendAction(s => s.sendEvent);
    
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

    // 보여줄 화면
    return <>
        {/* 컨텐츠 */}
        <ContentsLayout
            title='Team'
            titleRightSide={
                <></>
            }
            sideAreaWidth='300px'
            sideArea={<>
                {!isLoading &&
                    <MenuEditor menu={menuData} onMenuChange={onMenuChange} />
                }
            </>}
        >
            <div className={style['cont-area']}>
                <ContentArea />
            </div>
        </ContentsLayout>
        
        {/* 메뉴 데이터 로딩 시 */}
        <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'blue', type: 'bar' }}
        />
    </>;
}

export default Team;
