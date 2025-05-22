import dayjs from 'dayjs'

//* 커스텀 날짜 포맷 적용 (YYYY-MM-DD 등)
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat);

export default dayjs;