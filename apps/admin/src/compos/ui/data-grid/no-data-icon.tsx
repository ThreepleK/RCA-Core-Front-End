import { Flex, Text } from '@mantine/core';
import { IconDatabaseOff } from '@tabler/icons-react';

/**
 * 그리드 데이터 없음 표기
 */
export function NoDataIcon({ dataLen }: {
    dataLen: number;        // 데이터 길이
}){
    if( dataLen === 0 ){
        return <Flex justify='center' align='center' direction='column' gap='xs'>
            <IconDatabaseOff size={30} strokeWidth={1.5} />
            <Text size='md'>No Datas</Text>
        </Flex>;
    } else {
        return <></>;
    }
}