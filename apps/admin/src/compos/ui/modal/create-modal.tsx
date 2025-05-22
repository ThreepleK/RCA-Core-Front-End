import { Modal, Button, Flex, Checkbox } from "@mantine/core";
import { useCreateModalStore } from "./create-modal-store";

/**
 * 생성 모달
 */
export function CreateModal() {
  const {
    isOpen,
    isMore,
    isError,
    title,
    content,
    btnLabel,
    feedback,
    setOpen,
    setMore,
    setValue
} = useCreateModalStore((s) => s);

  //* 관련 이벤트 처리
  const onModal = (type: "cancel" | "create") => {
    if (type === "create" && typeof feedback === "function") {
      feedback();
    }

    if (type === "create" && isMore) {
      setOpen(true);
    } else {
      setOpen(false);
      setMore(false);
      setValue("");
    }
  };

  return (
    <Modal
      opened={isOpen}
      size="md"
      title={title}
      onClose={() => onModal("cancel")}
    >
      {content && content}

      <Flex justify="space-between" align="center" mt="md">
         <Checkbox label="Create more" mt="md" required onChange={(event) => setMore(event.currentTarget.checked)} />
        <Flex gap="sm">
          <Button size="xs" variant="default" onClick={() => onModal("cancel")}>
            {"Cancel"}
          </Button>
          <Button size="xs" onClick={() => onModal("create")} disabled={isError}>
            {btnLabel === null ? "Save" : btnLabel}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
