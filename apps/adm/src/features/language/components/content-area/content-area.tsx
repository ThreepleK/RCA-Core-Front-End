import { useEffect, useState } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import style from "./content-area.module.css";
import { UI_Flex, UI_Select, UI_Title } from "@/compos/ui";
import { useLocalSendEvent } from "../../stores";
import type {
    IFetchLanguageMenuItem,
    DataType,
} from "../../models";
import { api_getLanguageMenuData } from "../../apis";
import { SortableTable } from "../table";

export function ContentArea() {
    const [reloadFlag, setReloadFlag] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [languageCode, setLanguageCode] = useState<any[]>([]);
    const [selectedCode, setSelectedCode] = useState<any>();
    const [defaultData, setDefaultData] = useState<any[]>([]);
    const [checkedData, setCheckedData] = useState<any[]>([]);
    const sensors = useSensors(useSensor(PointerSensor));

    /*
     * 사이드바 메뉴 API 호출
     */
    // useEffect(() => {
    //     api_getLanguageMenuData().then(({ isErr, res }) => {
    //         if (isErr) {
    //             return;
    //         }
    //         // setData(res);
    //         setData([{ id: '1', language: 'korean', code: 'KO', default: true, status: 'ACTIVE' },{ id: '1', language: 'chinese', code: 'CN', default: false, status: 'ACTIVE' }, { id: '1', language: 'english', code: 'EN', default: false, status: 'ACTIVE' }] );
    //     });
    // }, [reloadFlag]);

    useEffect(() => {
        setData([{ id: '1', language: 'korean', code: 'KO', default: true, status: 'ACTIVE' },
            { id: '2', language: 'chinese', code: 'CN', default: false, status: 'ACTIVE' }, 
            { id: '3', language: 'english', code: 'EN', default: false, status: 'INACTIVE' }] );

        setLanguageCode([{ key: 'japanese', label: 'Japanese' },
            { key: 'german', label: 'German' }, 
            { key: 'franch', label: 'Franch' }]);

    }, []);

    useEffect(() => {
        if (!data) return;
        setDefaultData(["korean", "english"]);
        // setDefaultData(data[0]?.checkbox);
    }, [data]);

    const onChange = (checkedValues) => {
        setCheckedData(checkedValues);
    };

    const onChangeSelect = (key) => {
        setSelectedCode(key);
    };

    return (
        <div className={style["cont-area"]}>
            <div>
                {/* <UI_Title order={2} className={style.title}>
                    Available Languages
                </UI_Title> */}
                <UI_Flex vertical gap="middle">
                    <SortableTable dataSource={data} />
                </UI_Flex>
            </div>
        </div>
    );
}

export default ContentArea;
