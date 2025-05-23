import { useCommModalStore } from "@/compos/ui/modal/comm-modal-store";
import { Button, Text } from "@mantine/core";
import { api_updateItems } from "../../apis";

/**
 * [모달] 회원 비활성화 처리
 */
export function gridDeactiveModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="blue">Deactive member</Text>
        ),
        // 내용
        content: (
            <Text size="sm">
                Do you want to disable all selected users?
            </Text>
        ),
        // 버튼 표기
        buttons: {
            ok: <Button color='red' size='xs'>Deactive</Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await deactiveAction(key, rows);
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
 * 비활성화 처리
 */
async function deactiveAction(key: string, rows: any){
    // Deactive 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        return {
            isErr: true,
            res: null,
            msg: 'Not processed.'
        };
    }

    const reDatas = rows.map(r => ({
        ...r,
        status: 'inactive'
    }));

    console.log('reDatas', reDatas);

    // ... 비활성화 내용으로 처리
    // return await api_updateItems(reDatas);

    // (임시) 처리 비동기
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, 3000);
    });
}