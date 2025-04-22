import { NavLink, UnstyledButton } from '@mantine/core'
import { IconArrowBarToLeft, IconArrowBarToRight, IconCopyright, IconSettings } from '@tabler/icons-react'
import { useMainMenuStore, useUserStore } from '@repo/shared-state'
import { useNavigate } from 'react-router-dom'
import style from './tail-menu.module.css'

/**
 * 메인 하위 메뉴 표기 용
 */
export const TailMenu = () => {
    const navigate = useNavigate();
    
    // 메뉴 관련
    const {menuOpen, menuClose} = useMainMenuStore((state) => state);
    const isOpen = useMainMenuStore((state) => state.isOpen());

    // 로그인 사용자 정보
    const {user} = useUserStore((state) => state);

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
        ? <IconArrowBarToLeft size={20} stroke={1.5} />
        : <IconArrowBarToRight size={20} stroke={1.5} />
    ;

    return <>
        <div className={style['menu-area']}>
            {/* 메뉴 */}
            {_MENU_LIST.map((item) => {
                return <NavLink
                    key={item.label}
                    label={isOpen ? item.label : ''}
                    leftSection={item.icon}
                    onClick={() => navigate(item.link)}
                />
            })}

            {/* 사용자 정보 */}
            <UnstyledButton className='user-info'>
                <span>{user?.fullName.substring(0, 1)}</span>
                {isOpen ? user?.fullName : ''}
            </UnstyledButton>

            {/* Copyright & Folded */}
            <UnstyledButton className='copyright' onClick={onFoldToggle}>
                <span>{isOpen
                    ? <><IconCopyright size={14} stroke={1.5}/> 2025 Bistelligence, inc.</>
                    : <></>
                }</span>
                {foledBtn}
            </UnstyledButton>
        </div>
    </>
}

interface MenuItem {
    label: string,
    icon: any,
    link: string
};

//* 메뉴 리스트
const _MENU_LIST: MenuItem[] = [{
    label: 'Configuration',
    icon: <IconSettings size={20} stroke={1.5} />,
    link: '/',
}, ];