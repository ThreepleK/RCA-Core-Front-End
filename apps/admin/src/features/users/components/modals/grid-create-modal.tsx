import { useCommModalStore } from "@/compos/ui/modal/comm-modal-store";
import { Button, Switch, Text } from "@mantine/core";
import { FormEditContent } from "./form-edit-content";
import { api_createItem } from "../../apis";

/**
 * [모달] 추가
 */
export function gridCreateModal(
    callback: (data?: any) => void      // 확인 콜백
) {
    const { setOpen, setContent, setOnlyContent, setLoading } = useCommModalStore.getState();

    //* 추가 할 row 기본 값 데이터
    const srcRow = {
        name: '',
        email: '',
    };
    let row = {...srcRow};

    //* 컴포넌트에 사용될 키 값 (재 랜더링을 위함)
    let nodeKey = createNodeKey();

    //* 팝업창 유지 여부 (true: 유지, false: 안함)
    let isKeep = false;

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        row[key] = value;
    };

    //* 팝업창 유지 여부 설정
    const onSetCreateMore = (e: any) => {
        isKeep = e.currentTarget.checked;
    }
  
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <Text size="md" fw={500} c="blue">Create User</Text>
        ),
        // 내용
        content: (
            <FormEditContent row={row} onSetData={onSetData} key={nodeKey} />
        ),
        // 하단 왼쪽 영역
        bottomLeftSection: (
            <Switch
                label='Create more' size='xs'
                defaultChecked={isKeep}
                onChange={onSetCreateMore}
            />
        ),
        // 버튼 표기
        buttons: {
            ok: <Button size='xs'>Create</Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await createAction(key, row);
            console.log('결과', result);

            callback(result);

            // 모달창 유지
            if( isKeep ){
                // 초기 값, 재 랜더링을 위한 키 값 재설정
                row = {...srcRow};
                nodeKey = createNodeKey();

                // 본문만 다시 불러오기
                setOnlyContent(<FormEditContent row={row} onSetData={onSetData} key={nodeKey} />);
            }

            // 모달창 닫기 (정상처리 + 모달창 유지X)
            if( result && !isKeep ){
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
 * 노드에 사용될 키 값
 */
function createNodeKey(){
    return (new Date().getTime()) +'-create-node';
}

/**
 * 처리
 */
async function createAction(key: string, row: any){
    // Create 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        return {
            isErr: true,
            res: null,
            msg: 'Not processed.'
        };
    }

    // ... 생성 처리
    // return await api_createItem(row);

    // (임시) 처리 비동기
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, 3000);
    });
}