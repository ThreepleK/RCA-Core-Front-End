import { useConfirmModalStore } from './confirm-modal-store'
import { Modal, Button, Flex } from "@mantine/core"

/**
 * 확인 모달
 */
export function ConfirmModal(){
    //-- state
    const isOpen = useConfirmModalStore(s => s.isOpen);
    const title = useConfirmModalStore(s => s.title);
    const content = useConfirmModalStore(s => s.content);
    const btnLabel = useConfirmModalStore(s => s.btnLabel);
    
    //- Action
    const feedback = useConfirmModalStore(s => s.feedback);
    const setOpen = useConfirmModalStore(s => s.setOpen);

    //* 관련 이벤트 처리
    const onModal = (type: 'close'|'confirm') => {
        if( type === 'confirm' && typeof feedback === 'function' ){ feedback(); }
        setOpen(false);
    }

    return (
        <Modal opened={isOpen} size='xs' title={title} onClose={() => onModal('close')}>
            {content && content}
            <Flex justify='flex-end'>
                <Button size='xs' onClick={() => onModal('confirm')}>
                    {btnLabel === null ? 'Confirm' : btnLabel}
                </Button>
            </Flex>
        </Modal>
    );
}