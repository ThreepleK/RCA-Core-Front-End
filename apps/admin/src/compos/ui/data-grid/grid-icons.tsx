import { IconArrowsMaximize, IconArrowsMinimize, IconCaretDownFilled, IconClearAll, IconColumns, IconDotsVertical, IconEyeClosed, IconFilter, IconFilterOff, IconMenu2, IconSearch, IconSearchOff, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import type { MRT_Icons } from 'mantine-react-table';

export const gridIcons: Partial<MRT_Icons> = {
    //* -- 기타 다른 아이콘 ------
    //  IconArrowAutofitContent
    //  IconArrowsSort
    //  IconBoxMultiple
    //  IconChevronDown
    //  IconChevronLeft
    //  IconChevronRight
    //  IconChevronsDown
    //  IconCircleX
    //  IconDeviceFloppy
    //  IconEdit
    //  IconGripHorizontal
    //  IconPinned
    //  IconPinnedOff
    //  IconX


    //* -- 그리드 상단 툴바 ------
    //* 검색 ON/OFF
    IconSearch: (p: any) => <IconSearch size={18} />,
    IconSearchOff: (p: any) => <IconSearchOff size={18} />,

    //* 필터 ON/OFF
    IconFilter: (p: any) => <IconFilter size={18} />,
    IconFilterOff: (p: any) => <IconFilterOff size={18} />,

    //* 컬럼 선택
    IconColumns: (p: any) => <IconColumns size={18} />,

    //* 풀/최소화
    IconMaximize: (p: any) => <IconArrowsMaximize size={18} />,
    IconMinimize: (p: any) => <IconArrowsMinimize size={18} />,

    
    //* -- 그리드 헤더 ------
    //* 정렬 취소
    IconClearAll: (p: any) => <IconClearAll size={18} />,

    //* 오름차순, 내림차순 정렬
    IconSortAscending: (p: any) => <IconSortAscending size={18} />,
    IconSortDescending: (p: any) => <IconSortDescending size={18} />,

    //* 컬럼 숨기기
    IconEyeOff: (p: any) => <IconEyeClosed size={18} />,

    //* 로우 사이즈
    IconBaselineDensitySmall: (p: any) => <IconMenu2 size={18} />,

    //* 더보기 (가로/세로로)
    IconDots: (p: any) => <IconEyeClosed size={18} />,
    IconDotsVertical: (p: any) => <IconCaretDownFilled size={15} />,
};