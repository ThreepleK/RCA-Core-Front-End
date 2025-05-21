import { UnstyledButton, Menu } from '@mantine/core'
import { IconArrowBarToLeft, IconArrowBarToRight, IconBox, IconCopyright, IconLicense, IconNotification, IconSettings, IconTournament, IconUsersGroup } from '@tabler/icons-react'
import { useMainMenuStore, useUserStore } from '@repo/shared-state'
import style from './tail-menu.module.css'

/**
 * 메인 하위 메뉴 표기 용
 */
export const TailMenu = () => {    
    // 메뉴 관련
    const {menuOpen, menuClose} = useMainMenuStore((state) => state);
    const isOpen = useMainMenuStore((state) => state.isOpen());

    //* 접힘 펼침 처리
    const onFoldToggle = () => {
        if( isOpen ){
            menuClose();
        } else {
            menuOpen();
        }
    }

    // 접힘 펼침 버튼
    const foledBtn = isOpen
        ? <IconArrowBarToLeft size={16} stroke={1.5} />
        : <IconArrowBarToRight size={16} stroke={1.5} />
    ;

    return <>
        <div className={style['menu-area']}>
            {/* Copyright & Folded */}
            <UnstyledButton className='copyright' onClick={onFoldToggle}>
                <span>{isOpen
                    ? <><IconCopyright size={12} stroke={1.5}/>&nbsp;2025 Bistelligence, inc.</>
                    : <></>
                }</span>
                {foledBtn}
            </UnstyledButton>
        </div>
    </>
}