import dayjs from 'dayjs'

//* 커스텀 날짜 포맷 적용 (YYYY-MM-DD 등)
import customParseFormat from 'dayjs/plugin/customParseFormat'
//* UTC 적용
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export default dayjs;