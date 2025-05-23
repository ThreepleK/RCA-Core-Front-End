import { useCommModalStore } from "@/compos/ui/modal/comm-modal-store";
import { Button, Text } from "@mantine/core";
import { FormEditContent } from "./form-edit-content";
import { api_updateItems } from "../../apis";

/**
 * [모달] 수정
 */
export function gridEditModal(
    row: any,                           // 관련 row
    callback: (data?: any) => void      // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();

    //* 편집 데이터
    const editDatas = {...row};

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        editDatas[key] = value;
    };
  
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="blue">Edit Details</Text>
        ),
        // 내용
        content: (
            <FormEditContent row={row} onSetData={onSetData} />
        ),
        // 버튼 표기
        buttons: {
            cancel: <Button variant='default' size='xs'>Cancel</Button>,
            ok: <Button size='xs'>Save</Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            //* 취소 버튼 
            if( key === 'cancel' ){
                setOpen(false);
                return;
            }

            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await editAction(key, editDatas);
            console.log('결과', result);

            callback(result);

            // 모달창 닫기 (정상처리)
            if( result ){
                setOpen(false);
            }
            
            // 로딩 숨기기
            setLoading(false);
        },
        size: 'md',
    });

    //* 모달 열기
    setOpen(true);
}

/**
 * 처리
 */
async function editAction(key: string, row: any){
    // Save 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        return {
            isErr: true,
            res: null,
            msg: 'Not processed.'
        };
    }

    // ... 수정 처리
    // return await api_updateItems(row);

    // (임시) 처리 비동기
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, 3000);
    });

    // (임시) 처리 비동기
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, 3000);
    });
}