import { createSendAction } from "@/stores/send-event";

// Design 페이지에서 사용될 이벤트 전달 Store
export const useLocalSendEvent = createSendAction<any>();