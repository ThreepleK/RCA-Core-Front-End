// import KeepAliveRouter from './keep-alive-router'

// export default function() {

//     return <>
//         {/* 라우터 본문 출력 */}
//         <KeepAliveRouter />
//     </>
// }

import { Outlet } from "react-router-dom";

export default function() {
    console.log('---')
    return (
        <div>
            222
            <Outlet />
        </div>
    )
}