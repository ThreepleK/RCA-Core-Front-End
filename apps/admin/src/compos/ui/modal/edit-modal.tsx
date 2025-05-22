import { Modal, Button, Flex, Checkbox } from "@mantine/core";
import { useCreateModalStore } from "./create-modal-store";
import { useEditModalStore } from "./edit-modal-store";

/**
 * 생성 모달
 */
export function EditModal() {
  const {
    isOpen,
    isError,
    title,
    content,
    btnLabel,
    feedback,
    setOpen,
    setValue
} = useEditModalStore((s) => s);

  //* 관련 이벤트 처리
  const onModal = (type: "cancel" | "edit") => {
    if (type === "edit" && typeof feedback === "function") {
      feedback();
    }

    setOpen(false);
  };

  return (
    <Modal
      opened={isOpen}
      size="md"
      title={title}
      onClose={() => onModal("cancel")}
    >
      {content && content}

      <Flex justify="end" align="center" mt="md">
        <Flex gap="sm">
          <Button size="xs" variant="default" onClick={() => onModal("cancel")}>
            {"Cancel"}
          </Button>
          <Button size="xs" onClick={() => onModal("edit")} disabled={isError}>
            {btnLabel === null ? "Save" : btnLabel}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
