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
    // 처리할 아이템이 1개도 없을 때
    if( rows === null || (Array.isArray(rows) && rows.length === 0) ){
        noDataModal();
        return;
    }

    // 처리
    removeModal(rows, callback);
}

/**
 * [모달] 삭제할 아이템이 없을 때
 */
function noDataModal(){
    const { setOpen, setContent } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="red">Delete</Text>
        ),
        // 내용
        content: (
            <Text size="sm">
                Please select 1 or more items to delete.
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
 * [모달] 삭제할 아이템이 있을 때
 */
function removeModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
){
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="red">Delete</Text>
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

            // 모달창 닫기 (정상처리)
            if( result ){
                callback(result);
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
    const { setErrMsg } = useCommModalStore.getState();

    // 에러 메시지 초기화
    setErrMsg('');

    // remove 버튼이 아니면 건너 뜀
    if( key !== 'remove' ){
        setErrMsg('Not processed.');
        return false;
    }

    // 삭제 처리
    const res = await api_removeItems(rows);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}