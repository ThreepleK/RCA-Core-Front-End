import { useEffect, useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import style from './content-area.module.css'
import { Button, FileButton, Text, Group, Title, Image } from '@mantine/core';
import logo from '../../../../../../host/public/logo.png'

export function ContentArea({ isCancel, onChangeCancel }: {
    isCancel: boolean,
    onChangeCancel: (isCancel: boolean) => void
}){
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [reloadFlag, setReloadFlag] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor));
  
    useEffect(() => {
      if( isCancel ){
        onChangeCancel(false);
        setLogoFile(null);
        setFaviconFile(null);
      }
    }, [isCancel]); 
  
    return <div className={style['cont-area']}>
      <div className={style['logo-section']}>
        {/* 상단 타이틀 */}
        <Title order={2} className={style.title}>Logo</Title>
        <Image className={style.logo} radius="md" h={100} w="auto" fit="contain" src={logo} />

        {logoFile && (
        <Text size="sm" mt="sm">
          Picked file: {logoFile.name}
        </Text>
        )}
        <Group className={style['logo-group']}>
          <FileButton onChange={setLogoFile} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </Group>
      </div>
      <div className={style.divider} />
      <div className={style['favicon-section']}>
        {/* 상단 타이틀 */}
        <Title order={2} className={style.title}>Favicon</Title>

        {faviconFile && (
        <Text size="sm" mt="sm">
          Picked file: {faviconFile.name}
        </Text>
        )}
        <Group className={style['favicon-group']}>
          <FileButton onChange={setFaviconFile} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>
        </Group>
      </div>
    </div>;
  }


export default ContentArea;