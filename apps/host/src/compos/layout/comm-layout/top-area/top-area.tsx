import { useUserStore } from '@repo/shared-state'

import { Logo } from '@/compos/ui/logo';
import { DropdownUser, DropdownAdmin } from './';

import style from '../comm-layout.module.css'

export function TopArea(){
    // 로그인 사용자 정보, 관리자 여부
    const {user} = useUserStore((state) => state);

    return (
        <div className={style['cl-top']}>
            <div className={style['clt-left']}>
                <Logo />
            </div>
            <div className={style['clt-right']}>
                {/* 관리자 */}
                <DropdownAdmin />
                {/* 사용자 */}
                <DropdownUser />
            </div>
        </div>
    )
}