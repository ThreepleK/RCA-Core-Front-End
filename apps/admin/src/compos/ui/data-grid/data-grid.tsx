import { useEffect } from 'react';
import {
    MantineReactTable,
    MRT_TableInstance,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
} from 'mantine-react-table';
import { gridIcons } from './grid-icons'
import 'mantine-react-table/styles.css';
import style from './data-grid.module.css';
import { DataGridTopToolbar } from './data-grid-toptoolbar';

/**
 * 그리드
 * @param columns 컬럼 정보
 * @param data 그리드 내 보여줄 데이터
 * @param opts 그리드 기본 설정
 * @param onReady 그리드 준비완료
 */
export function DataGrid<T>({ columns, data, opts, onReady }: {
    columns: MRT_ColumnDef<T>[];
    data: any;
    opts?: MRT_TableOptions<T>;
    onReady?: (table: MRT_TableInstance<T>)=>void;
}){
    const table = useMantineReactTable({
        columns, data,
        enableRowNumbers: true,                 // 컬럼에 숫자 표기
        rowNumberDisplayMode: 'static',

        enableColumnResizing: false,            // 컬럼 리사이징
        enableRowSelection: false,              // 행 선택

        enableTopToolbar: true,                 // 상단 툴바 (필터)
        enableBottomToolbar: true,              // 하단 툴바 (페이지네이션)
        enableFullScreenToggle: true,           // 풀스크린 토글 버튼
        enableDensityToggle: false,             // 셀 세로 높이 토클 버튼
        initialState: {
            density: 'xs'                       // 셀 세로 높이 기본 값
        },

        icons: gridIcons,                       // 재설정 할 아이콘
        positionToolbarAlertBanner: 'bottom',   // 툴바 alert 위치

        //* 테이블 컨테이너 설정
        mantineTableContainerProps: {
            style: {
                height: 'calc(100% - 34px - 40px)', // 높이 100% - 상단툴바 높이 - 하단툴바 높이
                maxHeight: 'none',
            },
        },

        paginationDisplayMode: 'pages',
        mantinePaginationProps: () => ({
            size: 'xs',
        }),

        //* 그리드 전체 영역
        mantinePaperProps: () => ({
            radius: 'sm',
            withBorder: false,
            shadow: 'xs'
        }),

        //* 그리드 본문 설정
        mantineTableBodyProps: () => ({
            className: style['grid-body']
        }),

        //* 하단 툴바 설정
        mantineBottomToolbarProps: () => ({
            className: style['grid-bottom-toolbar']
        }),

        //* 상단 툴바 설정
        mantineTopToolbarProps: (props) => ({
            className: style['grid-top-toolbar']
        }),

        renderTopToolbar: ({ table }) => {
            return <DataGridTopToolbar table={table} />
        },

        //* 툴바 메시지
        mantineToolbarAlertBannerProps: () => ({
            className: style['grid-top-alert'],
            variant: 'transparent',
            radius: "xs",
        }),

        //* 진행바 설정
        mantineProgressProps: () => ({
            size: 'xs',
            color: 'teal',
        }),

        ...opts                                 // 별도 설정 값
    } as MRT_TableOptions<T>);

    // 컴포넌트 초기 설정
    useEffect(() => {
        if( !onReady ){ return; }
        onReady(table);
    }, []);

    return <MantineReactTable table={table} />;
}