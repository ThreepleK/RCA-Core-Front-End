import { useEffect, useState } from "react";
import { editViewStore } from "@/features/user-group/stores";

/**
 * [User Group > Edit]
 * Tab > Settings
 */
export function TabSettings(){
    const [raw, setRaw] = useState({});
    
    useEffect(() => {
        // 데이터 이벤트
        editViewStore.on('tab-settings', (row) => {
            setRaw(row)
        });

        // unMount
        return () => {
            editViewStore.off('tab-settings');
        };
    }, []);

    return <>Settings</>;
}