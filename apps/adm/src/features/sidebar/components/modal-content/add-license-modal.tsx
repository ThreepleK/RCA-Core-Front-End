import { UI_Alert, UI_Flex, UI_TextInput } from "@/compos/ui";
import { useState } from "react";

export function AddLicenseModal({
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
        <UI_Alert
          message="When main menu is empty, it will not be shown in the sidebar."
          type="warning"
          showIcon
        />
      </div>
      <div>
        <UI_TextInput
          label="Main menu name"
          error={errCode === "name" && errMsg}
          required
          onChange={(e) => onData(e.currentTarget.value, "name")}
        />
      </div>
    </UI_Flex>
  );
}

export default AddLicenseModal;
