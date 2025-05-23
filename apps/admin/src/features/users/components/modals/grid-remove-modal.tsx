import { useCommModalStore } from "@/compos/ui/modal/comm-modal-store";
import { Button, Text } from "@mantine/core";
import { api_removeItems } from "../../apis";

/**
 * [모달] 삭제
 */
export function gridRemoveModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="blue">Delete</Text>
        ),
        // 내용
        content: (
            <Text size="sm">
                Are you sure you want to delete?<br />
                This action cannot be undone.
            </Text>
        ),
        // 버튼 표기
        buttons: {
            remove: <Button color='red' size='xs'>Delete</Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await removeAction(key, rows);
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
async function removeAction(key: string, rows: any){
    // remove 버튼이 아니면 건너 뜀
    if( key !== 'remove' ){
        return {
            isErr: true,
            res: null,
            msg: 'Not processed.'
        };
    }

    // ... 삭제 처리
    // return await api_removeItems(rows);

    // (임시) 처리 비동기
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, 3000);
    });
}