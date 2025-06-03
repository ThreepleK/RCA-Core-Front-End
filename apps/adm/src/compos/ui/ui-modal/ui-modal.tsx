import { Modal, type ModalProps } from 'antd';

import style from './ui-modal.module.css'

/**
 * Modal 컴포넌트
 * https://ant.design/components/modal
 */
export function UI_Modal(props: ModalProps){
    // Antd Modal 기본 설정
    return <Modal {...props} rootClassName={style['ui-modal']} />
}