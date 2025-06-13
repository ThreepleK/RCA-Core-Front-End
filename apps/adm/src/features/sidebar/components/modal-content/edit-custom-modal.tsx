import { UI_Flex, UI_TextInput } from "@/compos/ui";
import { UI_Typography } from "@/compos/ui/ui-typography";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";

export function EditCustomModal({type, row, onSetData, errMsg, errCode,}: {
  type: "new" | "mod";
  row: any;
  onSetData?: (value: any, key: string) => void;
  errMsg?: string;
  errCode?: string;
}) {
  const [r, setRow] = useState([]);

  //* 초기 설정
    useEffect(() => { 
        if(!row) return;
        const cloneData = cloneDeep(row);
        setRow(cloneData)
    }, [row]);

  //* 데이터 설정
    const onData = (value: any, key: string) => {
        // 폼 데이터 재설정
        setRow((old) => {
            old[key] = value;
            return { ...old };
        });

        // 변경 데이터 전달
        // onSetData(value, key);
    };

    return (
        <UI_Flex vertical gap={16}>
            <div>
                <UI_TextInput
                label="Menu display name"
                value={row.displayName}
                error={errCode === "displayname" && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, "displayName")}
                />
            </div>

            <div>
                <UI_TextInput
                label="Redirect URL"
                value={row.url}
                error={errCode === "url" && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, "url")}
                />
            </div>
        </UI_Flex>
    );
}

export default EditCustomModal;
