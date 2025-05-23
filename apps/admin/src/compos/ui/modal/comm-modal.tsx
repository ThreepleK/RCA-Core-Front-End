import { Modal, Flex, LoadingOverlay } from "@mantine/core";
import { useCommModalStore } from "./comm-modal-store";
import { useMemo } from "react";

/**
 * 공용 모달
 */
export function CommModal() {
    const {
        isOpen, title, content, buttons, bottomLeftSection, modalSize, isLoading,
        feedback, setOpen
    } = useCommModalStore((s) => s);

    // 하단 영역
    const bottomArea = useMemo(() => {
        //* 좌/우측 영역
        const leftArea = bottomLeftSection ?? <>&nbsp;</>;
        const rightArea = [];

        //* 모달 버튼
        for( const key in buttons){
            const btn = buttons[key];
            rightArea.push(
                <div key={key} onClick={() => feedback(key)}>{btn}</div>
            );
        }

        return (
            <Flex gap="xs" justify="space-between" align="center" mt="md">
                <Flex gap="xs" justify="flex-start" align="center">{leftArea}</Flex>
                <Flex gap="xs" justify="flex-end" align="center">{rightArea}</Flex>
            </Flex>
        );
    }, [buttons]);

    // 닫기 처리
    const onClose = () => {
        // 로딩 중일 때는 닫지 않음
        if( isLoading ){ return; }

        // 모달 닫기
        setOpen(false);
    }

    return (
        <Modal opened={isOpen} size={modalSize} title={title} onClose={onClose}>
            {/* 모달 본문 */}
            {content && content}

            {/* 모달 하단 영역 */}
            {bottomArea}

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                transitionProps={{ transition: 'fade', duration: 250 }}
            />
        </Modal>
    );
}
