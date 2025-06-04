import { Upload, type UploadProps } from 'antd';
import style from './ui-upload.module.css'

/**
 * Upload 컴포넌트
 * https://ant.design/components/upload
 */
export function UI_Upload(props: UploadProps){
    
    // Antd Input 기본 설정
    // return <Upload {...props} rootClassName={style['ui-upload']} />
    return <Upload {...props}></Upload>
}