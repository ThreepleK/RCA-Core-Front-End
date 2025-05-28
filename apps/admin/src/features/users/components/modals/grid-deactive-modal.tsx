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
    // 처리할 아이템이 1개도 없을 때
    if( rows === null || (Array.isArray(rows) && rows.length === 0) ){
        noDataModal();
        return;
    }

    // 처리
    deactiveModal(rows, callback);
}

/**
 * [모달] 처리 할 아이템이 없을 때
 */
function noDataModal(){
    const { setOpen, setContent } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="red">Deactive member</Text>
        ),
        // 내용
        content: (
            <Text size="sm">
                Please select 1 or more items to Deactive member.
            </Text>
        ),
        // 버튼 표기
        buttons: {
            confirm: <Button size='xs'>Confirm</Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            setOpen(false);
        },
        size: 'xs',
    });

    //* 모달 열기
    setOpen(true);
}

/**
 * [모달] 처리 할 아이템이 있을 때때
 */
export function deactiveModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="red">Deactive member</Text>
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
async function deactiveAction(key: string, rows: any[]){
    const { setErrMsg } = useCommModalStore.getState();

    // Deactive 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        setErrMsg('Not processed.');
        return false;
    }

    // 비활성화 데이터로 가공
    const reDatas = rows.map(r => ({
        ...r,
        status: 'inactive'
    }));

    console.log('reDatas', reDatas);

    // 비활성화 내용으로 처리
    const res = await api_updateItems(reDatas);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}