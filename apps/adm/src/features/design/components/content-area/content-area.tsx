import { useEffect, useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import style from './content-area.module.css'
import logo from '../../../../../../host/public/logo.png'
import { UI_Button, UI_Input, UI_Title } from '@/compos/ui';
import { UI_Image } from '@/compos/ui/ui-image';
import { UI_Upload } from '@/compos/ui/ui-upload';
import { Typography } from 'antd';
import { useLocalSendEvent } from '../../stores';
import { UI_Typography } from '@/compos/ui/ui-typography';

export function ContentArea({ isCancel, onChangeCancel }: {
    isCancel: boolean,
    onChangeCancel: (isCancel: boolean) => void
}){
    const { Text } = Typography;
    const [systemName, setSystemName] = useState<string>(null);
    const [logoList, setLogoList] = useState([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [faviconList, setFaviconList] = useState([]);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

    const sendEvent = useLocalSendEvent();
    const { eKey, eVal, clean } = useLocalSendEvent.getState();
  
    useEffect(() => {
      if( isCancel ){
        onChangeCancel(false);
        setLogoFile(null);
        setFaviconFile(null);
      }
    }, [isCancel]); 

    const handleLogoUpload = (info) => {
      setLogoList(info.fileList); // fileList를 상태로 유지
    }

    const handleLogoReset = () => {
      setLogoList([]); // 리셋 시 파일 목록 초기화
    }

    const handleFaviconUpload = (info) => {
      setFaviconList(info.fileList); // fileList를 상태로 유지
    }

    const handleFaviconReset = () => {
      setFaviconList([]); // 리셋 시 파일 목록 초기화
    }
  
  
    return <div className={style['cont-area']}>
      <div className={style['system-section']}>
        <UI_Title order={2} className={style.title}>System name</UI_Title>
        <UI_Input style={{ width: '40%' }}  />
      </div>
      <div className={style['logo-section']}>
        <UI_Title order={2} className={style.title}>Logo</UI_Title>
          <UI_Image className={style.logo} width="auto" src={logo} />
          <div className={style.upload}>
            <UI_Upload beforeUpload={() => false} fileList={logoList} onChange={handleLogoUpload}>
              <UI_Button type="primary" onClick={handleLogoUpload}>Upload</UI_Button>
            </UI_Upload>
            <UI_Button onClick={handleLogoReset}>Reset</UI_Button>
          </div>
          <div className={style['sub-text']}>
          <UI_Typography typoType={'Text'} text={'200x200px is recommended'} />
          <UI_Typography typoType={'Text'} type="secondary" text={'Allowed JPG, PNG, GIF. Max size of 800K'} />
          </div>
      </div>
      <div className={style['favicon-section']} style={{ marginTop: '20px' }}>
        <UI_Title order={2} className={style.title}>Favicon</UI_Title>
          <UI_Image width="auto" src={logo} />
          <div className={style.upload}>
            <UI_Upload beforeUpload={() => false} fileList={faviconList} onChange={handleFaviconUpload}>
              <UI_Button type="primary">Upload</UI_Button>
            </UI_Upload>
            <UI_Button onClick={handleFaviconReset}>Reset</UI_Button>
          </div>
          <div className={style['sub-text']}>
          <UI_Typography typoType={'Text'} text={'200x200px is recommended'} />
          <UI_Typography typoType={'Text'} type="secondary" text={'Allowed JPG, PNG, GIF. Max size of 800K'} />
          </div>
      </div>
    </div>;
  }


export default ContentArea;