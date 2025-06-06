import { useEffect, useState } from "react";
import { editViewStore } from "@/features/user-group/stores";

/**
 * [User Group > Edit]
 * Tab > Permission sets
 */
export function TabPermissionSets(){
    const [raw, setRaw] = useState({});
    
    useEffect(() => {
        // 데이터 이벤트
        editViewStore.on('tab-permission', (row) => {
            setRaw(row)
        });

        // unMount
        return () => {
            editViewStore.off('tab-permission');
        };
    }, []);

    return <>Permission Sets</>;
}