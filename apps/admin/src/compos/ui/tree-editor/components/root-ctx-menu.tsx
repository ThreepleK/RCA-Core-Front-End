import { IconPlus } from '@tabler/icons-react';

import { useCtxMenuStore, CtxMenuItem } from '@/compos/ui/ctx-menu'
import { useCtxBoxStore } from '@/compos/ui/ctx-box'
import { EditBox, useRootCtxMenuStore } from './'
import { useEffect } from 'react';

/**
 * Root 메뉴
 */
export function RootCtxMenu(){
    //-- root 우클릭
    const clientX = useRootCtxMenuStore(s => s.clientX);
    const clientY = useRootCtxMenuStore(s => s.clientY);
    const label = useRootCtxMenuStore(s => s.label);
    const isOpen = useRootCtxMenuStore(s => s.isOpen);
    const close = useRootCtxMenuStore(s => s.close);
    
    //-- 우클릭
    const ctxIsOpen = useCtxMenuStore(s => s.isOpen);
    const setOpen = useCtxMenuStore(s => s.setOpen);
    const setPosition = useCtxMenuStore(s => s.setPosition);
    const setMenuList = useCtxMenuStore(s => s.setMenuList);

    const setBoxOpen = useCtxBoxStore(s => s.setOpen);
    const setBoxPosition = useCtxBoxStore(s => s.setPosition);
    const setBoxContent = useCtxBoxStore(s => s.setContent);

    //* 메뉴 오픈
    useEffect(() => {
        // 메뉴 가져오기
        const menu = getCtxMenu(label);

        // 컨텐츠 박스 열기
        const boxOpen = (content: any) => {
            setBoxContent(content);
            setBoxPosition(clientX, clientY);
            setBoxOpen(true);
        };

        // 메뉴 설정 및 선택 이벤트 처리
        setMenuList(menu, (selected) => {
            switch( selected ){
                //* 루트 아이템 추가
                case 'root-add':
                    boxOpen(
                        <EditBox
                            title='Add item'
                            mode='add'
                            isRoot={true}
                            item={{
                                id: '',
                                label: '',
                                selected: false,
                            }}
                        />
                    );
                break;
            }
        });

        // 메뉴 표기
        setPosition(clientX, clientY);
        setOpen(isOpen);
    }, [clientX, clientY, isOpen]);

    // 메뉴 on/off 제어
    useEffect(() => {
        // 닫기 처리
        if( !ctxIsOpen ){ close(); }
    }, [ctxIsOpen]);

    return <></>
}

/**
 * 루트 메뉴 가져오기
 */
function getCtxMenu(label: string){
    _ROOT_CTX_MENUS[0].label = label;
    return _ROOT_CTX_MENUS;
}

//* 루트 메뉴
const _ROOT_CTX_MENUS: CtxMenuItem[] = [
    {type: 'label', label: '', value: ''},
    {type: 'item', label: 'Add item', value: 'root-add', icon: <IconPlus size={16} />},
]