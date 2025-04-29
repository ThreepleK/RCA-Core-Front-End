import { Title, NavLink, Input, Button } from '@mantine/core';
import { IconFolderUp, IconFolderDown, IconSettings, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import style from './comm-layout.module.css'
import { useEffect, useState } from 'react';
import { useSideMenuStore } from '@/stores/';

/**
 * 사이드 영역
 */
export function SideArea({className}: {
    className: string
}){
    const isFoled = useSideMenuStore((s: any) => s.isFolded());
    const {setAllFold, setAllUnFold, setMenuTotalCnt} = useSideMenuStore((s: any) => s);

    //* 초기 설정
    useEffect(() => {
        // 최상단 메뉴 총 갯수 설정
        setMenuTotalCnt(_MENU_LIST.length);
    }, []);

    //* 메뉴 토글
    const onToggle = () => {
        if( isFoled ){
            setAllUnFold()
        } else {
            setAllFold();
        }
    }

    return (
        <div className={className}>
            <Title order={2} className={style.title}>Settings</Title>
            <div className={style.search}>
                <Input />
                <Button variant='default' size="xs" radius="sm" onClick={onToggle}>
                    { isFoled
                        ? <IconFolderDown size={20} />
                        : <IconFolderUp size={20} />
                    }
                </Button>
            </div>
            <MenuPrint menuList={_MENU_LIST} />
        </div>
    );
}

function MenuItem({label, link, icon, childs, depth, isOpen}: {
    label: string,          // 메뉴
    link?: string,          // 이동할 링크
    icon?: any,             // 표기될 아이콘
    childs?: MenuItem[],    // 하위 항목이 있다면 관련 리스트
    isOpen?: boolean,       // 메인 메뉴라면 펼침 여부 
    depth: number,
}){
    const navigate = useNavigate();
    const {setFold, setUnFold, childSuccess} = useSideMenuStore((s: any) => s);
    const isFoledChild = useSideMenuStore((s: any) => s.isFoledChild());
    const [isOepnState, setIsOpenState] = useState<boolean>(isOpen ?? true);

    // 전체 메뉴 토글 처리 할 경우 
    useEffect(() => {
        if( isFoledChild === null || depth !== 0 ){ return; }

        childSuccess();
        setIsOpenState(!isFoledChild);
    }, [isFoledChild])

    //* 메뉴 접힘/펼침 상태 업데이트
    const onMenuChange = (opened: boolean) => {
        // 첫번째 메뉴가 아니면 건너 뜀
        if( depth !== 0 ){ return; }

        if( opened ){
            setUnFold();
        } else {
            setFold();
        }

        setIsOpenState(opened);
    }

    //* 메뉴 클릭
    const onMenuClick = (e: any, link?: string) => {
        // NavLink의 기본 a href가 동작하지 않기 위함
        e.preventDefault();

        // 이동 할 링크 가 없으면 처리 안함
        if( !link || link === '' || link === '#' ){ return; }

        // react-router-dom을 이용한 페이지 이동
        navigate(link);
    }

    return <NavLink label={label}
        key={label}
        // href={link}
        leftSection={icon}
        onChange={onMenuChange}
        onClick={(e: any) => { onMenuClick(e, link) }}
        opened={isOepnState}
    >
        {childs && childs.map(c => <MenuItem depth={depth+1} key={c.label} {...c} />)}
    </NavLink>;

}

/**
 * 메뉴 출력
 */
function MenuPrint({ menuList }: {
    menuList: MenuItem[],       // 메뉴 리스트
}) {
    
    // 출력할 메뉴가 없을 경우
    if( !menuList || menuList.length === 0 ){ return <></>; }

    return menuList.map((item: MenuItem) => {   
        return <MenuItem depth={0} {...item} />;
    })
}

interface MenuItem {
    label: string,
    link?: string,
    icon?: any,
    childs?: MenuItem[],
    isOpen?: boolean,
};

//* 메뉴 리스트
const _MENU_LIST: MenuItem[] = [
    {
        label: 'Team',
        icon: <IconUsersGroup size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Management', link: '/admin' },
            { label: 'Permission', link: '/admin/permission' },
        ]
    },
    {
        label: 'User',
        icon: <IconUser size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Member', link: '/admin' },
            { label: 'User group', link: '/admin/user-group' },
        ]
    },
    {
        label: 'System preferences',
        icon: <IconSettings size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Logo', link: '/admin' },
            { label: 'Favicon', link: '/admin' },
            { label: 'Sidebar menu', link: '/admin' },
            { label: 'Application menu', link: '/admin' },
        ]
    },
];