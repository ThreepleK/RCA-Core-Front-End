import { UI_LoadingOverlay } from "../../ui-loading-overlay";

/**
 * 커스텀 로딩 처리
 */
export function CustomLoading(props: {}){
    return (
        <UI_LoadingOverlay isOpen={true} />
    );
}