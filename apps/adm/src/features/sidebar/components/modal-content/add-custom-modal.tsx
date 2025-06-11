import { UI_Flex, UI_TextInput } from "@/compos/ui";
import { UI_Typography } from "@/compos/ui/ui-typography";
import { useState } from "react";

export function AddCustomModal({
  type,
  onSetData,
  errMsg,
  errCode,
}: {
  type: "new" | "mod";
  onSetData?: (value: any, key: string) => void;
  errMsg?: string;
  errCode?: string;
}) {
  const [r, setRow] = useState([]);

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

          error={errCode === "displayname" && errMsg}
          required
          onChange={(e) => onData(e.currentTarget.value, "displayname")}
        />
        </div>
        <div>
        <UI_TextInput
          label="Redirect URL"
          error={errCode === "url" && errMsg}
          required
          onChange={(e) => onData(e.currentTarget.value, "url")}
        />
      </div>
    </UI_Flex>
  );
}

export default AddCustomModal;
