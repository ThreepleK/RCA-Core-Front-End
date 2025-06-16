import { useEffect, useState } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import style from "./content-area.module.css";
import { UI_Button, UI_Flex, UI_Input, UI_Switch, UI_Title } from "@/compos/ui";
import { useLocalSendEvent } from "../../stores";
import { UI_Table } from "@/compos/ui/ui-table";
import type {
    IFetchLanguageMenu,
    IFetchLanguageMenuItem,
    DataType,
} from "../../models";
import { api_getLanguageMenuData } from "../../apis";
import type { TableColumnsType } from "antd";

export function ContentArea({
    isCancel,
    onChangeCancel,
}: {
    isCancel: boolean;
    onChangeCancel: (isCancel: boolean) => void;
}) {
    const [reloadFlag, setReloadFlag] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [defaultData, setDefaultData] = useState<any[]>([]);
    const [checkedData, setCheckedData] = useState<any[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));

    /*
     * 사이드바 메뉴 API 호출
     */
    useEffect(() => {
        api_getLanguageMenuData().then(({ isErr, res }) => {
            if (isErr) {
                return;
            }
            setData(res);
        });
    }, [reloadFlag]);

    useEffect(() => {
        if (!data) return;
        setDefaultData(["korean", "english"]);
        // setDefaultData(data[0]?.checkbox);
    }, [data]);

    const onChange = (checkedValues) => {
        console.log("checked = ", checkedValues);
        setCheckedData(checkedValues);
    };

    return (
        <div className={style["cont-area"]}>
            <div className={style["core-table"]}>
                {/* <UI_Title order={2} className={style.title}>
                    Available Languages
                </UI_Title> */}
                <UI_Flex vertical gap="middle">
                    {/* <UI_FormCheckbox
                        label="Available languages"
                        defaultValue={defaultData}
                        value={checkedData}
                        onChange={onChange}
                        vertical
                        data={[
                            { value: "english", label: "English" },
                            { value: "chinese", label: "Chinese" },
                            { value: "spanish", label: "Spanish" },
                            { value: "hungarian", label: "Hungarian" },
                            { value: "korean", label: "Korean" },
                        ]}
                    /> */}
                    checkbox area
                </UI_Flex>
            </div>
        </div>
    );
}

export default ContentArea;
