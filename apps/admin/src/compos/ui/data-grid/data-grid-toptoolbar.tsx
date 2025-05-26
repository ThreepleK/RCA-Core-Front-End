import { MRT_GlobalFilterTextInput, MRT_ProgressBar, MRT_ShowHideColumnsButton, MRT_TableInstance, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton } from "mantine-react-table";
import style from './data-grid-toptoolbar.module.css'

export function DataGridTopToolbar<T>({ table }: {
    table: MRT_TableInstance<T>
}){
    const total = table.getRowCount();

    return (
        <div className={style['grid-top-toolbar']}>
            {/* 좌측 영역 */}
            <div className={style['side-area']}>Total: {total.toLocaleString('ko-KR')}</div>
            
            {/* 우측 영역 */}
            <div className={style['actions-area']}>
                <MRT_GlobalFilterTextInput table={table} />
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
            </div>
            <MRT_ProgressBar isTopToolbar={true} table={table} />
        </div>
    );
}