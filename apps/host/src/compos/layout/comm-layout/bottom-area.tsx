import { useRouterStore, RouterItem } from '@repo/shared-state'

import style from './comm-layout.module.css'
import { IconX } from "@tabler/icons-react";
import { useRef } from "react";

export function BottomArea(){
    const { list } = useRouterStore(s => s);

    return (
        <div className={style['cl-bottom']}>
            {list.map((item, idx) => <TabItem item={item} key={idx} />)}
        </div>
    );
}

function TabItem({ item }: {
    item: RouterItem,               // 탭 아이템
}){
    const divRef = useRef(null);
    const { currItem, pageMove, tabClose } = useRouterStore(s => s);
    const active = currItem?.cacheKey === item.cacheKey ? 'on-active' : '';

    //* 탭 선택
    const onTabSelect = (e: any) => {
        // 닫기 버튼 제외 처리
        if( e.target !== divRef.current ){ return; }

        pageMove({
            label: item.tabLabel,
            path: item.path,
            type: item.itemType,
        });
    }

    //* 탭 닫기
    const onTabClose = (e: any) => {
        tabClose(item.cacheKey);
    }

    return (
        <div
            ref={divRef}
            className={`${style['tab-item']} ${active}`}
            onClick={onTabSelect}
        >
            {item.tabLabel}
            <IconX size={12} strokeWidth={1.25} onClick={onTabClose} />
        </div>
    );
}