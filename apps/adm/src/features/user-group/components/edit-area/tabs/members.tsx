import { editViewStore } from "@/features/user-group/stores";
import { useEffect, useState } from "react";

/**
 * [User Group > Edit]
 * Tab > Members
 */
export function TabMembers(){
    const [raw, setRaw] = useState({});

    useEffect(() => {
        // 데이터 이벤트
        editViewStore.on('tab-members', (row) => {
            setRaw(row)
        });

        // unMount
        return () => {
            editViewStore.off('tab-members');
        };
    }, []);

    return <>Members</>;
}