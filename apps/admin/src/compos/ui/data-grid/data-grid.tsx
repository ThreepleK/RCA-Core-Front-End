import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_TableOptions,
} from 'mantine-react-table';
import { gridIcons } from './grid-icons'
import 'mantine-react-table/styles.css';
import style from './data-grid.module.css';

/**
 * 그리드
 * @param columns 컬럼 정보
 * @param data 그리드 내 보여줄 데이터
 * @param opts 그리드 기본 설정
 */
export function DataGrid<T>({ columns, data, opts }: {
    columns: MRT_ColumnDef<T>[];
    data: any;
    opts?: MRT_TableOptions<T>;
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
        enableDensityToggle: true,              // 셀 세로 높이 토클 버튼
        initialState: {
            density: 'xs'                       // 셀 세로 높이 기본 값
        },

        icons: gridIcons,                       // 재설정 할 아이콘

        //* 상단 툴바 설정
        mantineTopToolbarProps: (props) => ({
            className: style['grid-top-toolbar']
        }),

        ...opts                                 // 별도 설정 값
    } as MRT_TableOptions<T>);

    return <MantineReactTable table={table} />;
}