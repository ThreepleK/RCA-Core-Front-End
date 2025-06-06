import { SectionStore } from "@/stores";
import { createSendAction } from "@/stores/send-event";

// User Group 페이지에서 사용될 이벤트 전달 Store
export const useLocalSendEvent = createSendAction<any>();

// Edit view에서 사용 될 이벤트 전달 용 store
export const editViewStore = new SectionStore();