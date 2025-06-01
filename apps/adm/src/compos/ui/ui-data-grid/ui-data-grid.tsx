import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';

//* AgGrid 커뮤니티 버전 설정
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { type ColDef as coldef } from 'ag-grid-community';
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
export function UI_DataGrid(props: AgGridReactProps){
    // AgGrid 기본 설정
    return <AgGridReact {...props} />
}