import { useConfirmModalStore } from './confirm-modal-store'
import { Modal, Button, Flex } from "@mantine/core"

/**
 * 확인 모달
 */
export function ConfirmModal(){
    const {isOpen, title, content, btnLabel, feedback, setOpen} = useConfirmModalStore(s => s);

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