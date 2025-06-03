import style from './ui-loading-overlay.module.css'

/**
 * 로딩 컴포넌트
 */
export function UI_LoadingOverlay({visible=true, zIndex=9999}: {
    visible?: boolean   // 보임여부
    zIndex?: number     // z축 index
}){
    return <>
        {visible && <div
            style={{
                '--lo-zIndex': zIndex   // 로딩 표기할 z축
            } as any}
            className={style['ui-loading-overlay']}
        >로딩</div>}
    </>;
}