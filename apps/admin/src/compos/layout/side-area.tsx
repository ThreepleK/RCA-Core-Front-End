import { Title, NavLink, Input, Button } from '@mantine/core';
import { IconFolderUp, IconFolderDown, IconSettings, IconUser, IconUsersGroup } from '@tabler/icons-react';
import style from './comm-layout.module.css'
import { useEffect, useState } from 'react';
import { create } from 'zustand';

/**
 * 사이드 영역
 */
export function SideArea({className}: {
    className: string
}){
    const isFoled = useStore((s: any) => s.isFolded());
    const {setAllFold, setAllUnFold, setMenuTotalCnt} = useStore((s: any) => s);

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
    label: string,
    link: string,
    icon?: any,
    childs?: MenuItem[],
    isOpen?: boolean,
    depth: number,
}){
    const {setFold, setUnFold, childSuccess} = useStore((s: any) => s);
    const isFoledChild = useStore((s: any) => s.isFoledChild());
    const [isOepnState, setIsOpenState] = useState<boolean>(isOpen ?? true);

    // 전체 메뉴 토글 처리 할 경우 
    useEffect(() => {
        if( isFoledChild === null || depth !== 0 ){ return; }

        childSuccess();
        setIsOpenState(!isFoledChild);
    }, [isFoledChild])


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

    return <NavLink label={label}
        key={label}
        href={link}
        leftSection={icon}
        onChange={onMenuChange}
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
    link: string,
    icon?: any,
    childs?: MenuItem[],
    isOpen?: boolean,
};

//* 메뉴 리스트
const _MENU_LIST: MenuItem[] = [
    {
        label: 'Team',
        icon: <IconUsersGroup size={16} stroke={1.5} />,
        link: '/admin',
        isOpen: true,
        childs: [
            { label: 'Management', link: '/admin' },
            { label: 'Permission', link: '/admin/permission' },
        ]
    },
    {
        label: 'User',
        icon: <IconUser size={16} stroke={1.5} />,
        link: '/admin',
        isOpen: true,
        childs: [
            { label: 'Member', link: '/admin' },
            { label: 'User group', link: '/admin/user-group' },
        ]
    },
    {
        label: 'System preferences',
        icon: <IconSettings size={16} stroke={1.5} />,
        link: '/admin',
        isOpen: true,
        childs: [
            { label: 'Logo', link: '/admin' },
            { label: 'Favicon', link: '/admin' },
            { label: 'Sidebar menu', link: '/admin' },
            { label: 'Application menu', link: '/admin' },
        ]
    },
];

// 메뉴 접힘 여부를 제어 하기 위한 스토어 설정
const useStore = create((set, get: any) => ({
    max: 3,             // 메인 메뉴 갯수
    cnt: 0,
    childSuccessCnt: 0,
    isParent: false,

    //* 메뉴 갯수 설정
    setMenuTotalCnt: (total: number) => {
        set({max: total});
    },

    //* 메뉴 전체 접힘 상태
    isFolded: () => {
        return get().cnt === get().max;
    },

    //* setAllFold, setAllUnFold를 통해 하위 메뉴가 제어하기 위한 상태
    isFoledChild: () => {
        if( !get().isParent ){ return null; }
        return get().cnt === get().max;
    },
    
    //* 접힘 처리
    setFold: () => {
        const cnt = get().cnt;
        set({cnt: cnt + 1});
    },
    //* 펼침 처리
    setUnFold: () => {
        const cnt = get().cnt;
        set({cnt: cnt - 1});
    },
    //* 전체 접힘
    setAllFold: () => {
        const max = get().max;
        set({
            cnt: max,
            isParent: true,
            childSuccessCnt: 0,
        });
    },
    //* 전체 펼침
    setAllUnFold: () => {
        set({
            cnt: 0,
            isParent: true,
            childSuccessCnt: 0,
        });
    },
    //* 하위 항목 처리
    childSuccess: () => {
        const max = get().max;
        const cCount = get().childSuccessCnt + 1;

        if( max <= cCount ){
            set({
                isParent: false,
                childSuccessCnt: 0,
            });
        } else {
            set({
                childSuccessCnt: cCount,
            });
        }
    },
}));