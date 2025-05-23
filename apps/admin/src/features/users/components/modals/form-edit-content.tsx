import { Group, Radio, Stack, TextInput } from "@mantine/core";
import style from "./form-edit-content.module.css";

/**
 * 모달창에서
 * 추가/수정에 사용될 폼
 * @param props
 * @param props.row 폼에 전달할 그리드 row 데이터
 * @param props.onSetData 한 항목당 변경할 데이터
 */
export function FormEditContent({row, onSetData}: {
    row: any;
    onSetData: (value: any, key: string) => void;
}){
    return <>
        <Stack>
            <TextInput
                label="Name"
                defaultValue={row.name}
                required
                onChange={(e) => onSetData(e.currentTarget.value, 'name')}
            />
            <TextInput
                label="Email"
                defaultValue={row.email}
                required
                onChange={(e) => onSetData(e.currentTarget.value, 'email')}
            />
            <Radio.Group
                label="Status"
                withAsterisk
                defaultValue={row.status}
                onChange={(e) => onSetData(e, 'status')}
                size="sm"
            >
                <Group gap="sm">
                    <Radio className={style.radio} size="sm" value="active" label="Active" />
                    <Radio className={style.radio} size="sm" value="inactive" label="Inactive" />
                </Group>
            </Radio.Group>
        </Stack>
    </>;
}