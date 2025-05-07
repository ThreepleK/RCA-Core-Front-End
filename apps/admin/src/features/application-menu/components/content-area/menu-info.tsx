import { Flex, TextInput, Switch, Button } from '@mantine/core';

import style from './content-area.module.css'

export function MenuInfo(){
    return <Flex direction="column" gap="xs" justify="center" className={style['menu-info']}>
        <TextInput label="Menu ID" disabled />
        <TextInput label="Parent menu ID" disabled />
        <TextInput label="Menu name" />
        <TextInput label="Menu path" />
        <Switch.Group label='Status' defaultValue={['status']}>
            <Switch size='sm' color="teal" value='status' />
        </Switch.Group>

        <Button>Save</Button>
    </Flex>
}