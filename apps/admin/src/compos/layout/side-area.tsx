import { Title, NavLink, Input, Button } from '@mantine/core';
import { IconFolderUp, IconFolderDown, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSideMenuStore } from '@/stores';
import { MenuItem as MenuItemType, MenuList } from './menu-list';

import style from './comm-layout.module.css'

/**
 * 사이드 영역
 */
export function SideArea({className}: {
    className: string
}){
    const isFoled = useSideMenuStore((s: any) => s.isFolded());
    const {setAllFold, setAllUnFold, setMenuTotalCnt} = useSideMenuStore((s: any) => s);
    const [inputVal, setInputVal] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    //* 초기 설정
    useEffect(() => {
        // 최상단 메뉴 총 갯수 설정
        setMenuTotalCnt(MenuList.length);
    }, []);

    //* 메뉴 토글
    const onToggle = () => {
        if( isFoled ){
            setAllUnFold()
        } else {
            setAllFold();
        }
    }

    //* 메뉴 검색
    const onSearch = () => {
        setSearchKeyword(inputVal);
    }

    return (
        <div className={className}>
            {/* 제목 */}
            <Title order={3} className={style.title}>Settings</Title>
            {/* 검색 영역 */}
            <div className={style.search}>
                <Input size='xs'
                    value={inputVal}
                    onChange={(event) => setInputVal(event.currentTarget.value)}
                    onKeyUp={(e) => { if(e.keyCode === 13){ onSearch(); } }}
                    rightSectionPointerEvents="all"
                    rightSection={
                        <IconSearch size={20} onClick={onSearch} />
                    }
                />
                <Button variant='default' size="xs" radius="sm" onClick={onToggle}>
                    { isFoled
                        ? <IconFolderDown size={20} />
                        : <IconFolderUp size={20} />
                    }
                </Button>
            </div>
            {/* 메뉴 */}
            <MenuPrint menuList={MenuList} searchKeyword={searchKeyword} />
        </div>
    );
}

function MenuItem({label, link, icon, childs, depth, isOpen, searchKeyword}: {
    label: string,              // 메뉴
    link?: string,              // 이동할 링크
    icon?: any,                 // 표기될 아이콘
    childs?: MenuItemType[],    // 하위 항목이 있다면 관련 리스트
    isOpen?: boolean,           // 메인 메뉴라면 펼침 여부 
    depth: number,              // 메뉴 깊이 번호
    searchKeyword: string,      // 검색 키워드
}){
    const navigate = useNavigate();
    const {setFold, setUnFold, childSuccess} = useSideMenuStore((s: any) => s);
    const isFoledChild = useSideMenuStore((s: any) => s.isFoledChild());
    const [isOepnState, setIsOpenState] = useState<boolean>(isOpen ?? true);
    const [isShow, setIsShow] = useState<boolean>(true);
    const [searchLabel, setSearchLabel] = useState<any>(<>{label}</>);

    //* 검색 키워드가 있을 때 숨김/보임 처리
    useEffect(() => {
        // 첫번째 메뉴는 건너 뜀
        if( depth === 0 ){ return; }

        // 검색 키워드 정규식에 맞는 포맷으로 변환
        const search = searchKeyword.trim().replace(/\s/gi, '\\s');

        //* 검색 키워드 X → 다 보이기
        if( search === '' ){
            setIsShow(true);
            setSearchLabel(<>{label}</>);
        }
        //* 검색 키워드 O
        else {
            // 관련 키워드 보이기 설정
            if( RegExp(search, 'i').test(label) ){
                const changeLabel = label.replace(RegExp(search, 'i'), `<b>${searchKeyword}</b>`);

                setIsShow(true);
                setSearchLabel(<span className={style['search-keyword']} dangerouslySetInnerHTML={{__html: changeLabel}} />);
            }
            // 관련 키워드 아니면 숨김 설정
            else {
                setIsShow(false);
                setSearchLabel(<>{label}</>);
            }
        }
    }, [searchKeyword]);

    //* 전체 메뉴 토글 처리 할 경우 
    useEffect(() => {
        // 전체 메뉴 토글 요청이 아니거나, 하위 메뉴는 건너 뜀
        if( isFoledChild === null || depth !== 0 ){ return; }

        // 전체 메뉴 중 메인 메뉴 1개씩 처리 업데이트
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

    //* 검색 키워드에 맞지 않아 보이지 않아야 할 때
    if( !isShow ){ return <></>; }

    //* 메뉴 표기
    return <NavLink
        label={searchLabel}
        key={label}
        leftSection={icon}
        onChange={onMenuChange}
        onClick={(e: any) => { onMenuClick(e, link) }}
        opened={isOepnState}
    >
        {childs && childs.map(c => <MenuItem
            depth={depth+1}
            key={c.label}
            searchKeyword={searchKeyword}
            {...c}
        />)}
    </NavLink>;

}

/**
 * 메뉴 출력
 */
function MenuPrint({ menuList, searchKeyword }: {
    menuList: MenuItemType[];       // 메뉴 리스트
    searchKeyword: string;      // 메뉴 검색
}) {
    
    // 출력할 메뉴가 없을 경우
    if( !menuList || menuList.length === 0 ){ return <></>; }

    return menuList.map((item: MenuItemType) => {   
        return <MenuItem depth={0} searchKeyword={searchKeyword} {...item} />;
    })
}