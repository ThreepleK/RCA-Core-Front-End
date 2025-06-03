import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';

//* AgGrid 커뮤니티 버전 설정
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { type ColDef as coldef } from 'ag-grid-community';
import { forwardRef, useMemo, type Ref } from 'react';
import { CustomLoading } from './custom-loading';
ModuleRegistry.registerModules([ AllCommunityModule ]);

// 컬럼
export type ColDef = coldef;

/**
 * DataGrid 컴포넌트 (AgGrid)
 * --------------------------------------------------------------------------
 * Columns:       https://www.ag-grid.com/react-data-grid/column-definitions/
 * Rows:          https://www.ag-grid.com/react-data-grid/row-ids/
 * Cell:          https://www.ag-grid.com/react-data-grid/cell-content/
 * Filtering:     https://www.ag-grid.com/react-data-grid/filtering-overview/
 * Selection:     https://www.ag-grid.com/react-data-grid/row-selection/
 * Editing:       https://www.ag-grid.com/react-data-grid/cell-editing/
 * Updating data: https://www.ag-grid.com/react-data-grid/data-update-row-data/
 * Interaction:   https://www.ag-grid.com/react-data-grid/keyboard-navigation/
 */
export const UI_DataGrid = forwardRef((
    props: AgGridReactProps,
    ref: Ref<AgGridReact<any>>
) => {
    // 속성 재설정
    const reProps = useMemo(() => {
        return {
            rowSelection: {                             // row 선택
                mode: 'multiRow'                        // -- 멀티 모드
            },

            loadingOverlayComponent: CustomLoading,     // 커스텀 로딩
            loadingOverlayComponentParams: {},          // 커스텀 로딩 컴포넌트 props
            
            ...props
        } as AgGridReactProps;
    }, [props]);

    return <AgGridReact {...reProps} ref={ref} />
})