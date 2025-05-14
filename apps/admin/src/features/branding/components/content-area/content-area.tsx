import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import style from './content-area.module.css'
import { Button, FileButton, Text, Group, Title, Image } from '@mantine/core';
import logo from '../../../../../../host/public/logo.png'

export function ContentArea({ className }: {
    className: string,
}){
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [reloadFlag, setReloadFlag] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor));
  
  
    return <div className={className}>
      <div className={style['logo-section']}>
        {/* 상단 타이틀 */}
        <Title order={2} className={style.title}>Logo</Title>
        <Image className={style.logo} radius="md" h={100} w="auto" fit="contain" src={logo} />

        {file && (
        <Text size="sm" mt="sm">
          Picked file: {file.name}
        </Text>
        )}
        <Group className={style['logo-group']}>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </Group>
      </div>
      <div className={style.divider} />
      <div className={style['favicon-section']}>
        {/* 상단 타이틀 */}
        <Title order={2} className={style.title}>Favicon</Title>

        {file && (
        <Text size="sm" mt="sm">
          Picked file: {file.name}
        </Text>
        )}
        <Group className={style['favicon-group']}>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </Group>
      </div>
    </div>;
  }


export default ContentArea;