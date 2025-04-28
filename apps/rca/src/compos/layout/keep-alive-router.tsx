// import { useKeepAliveRef } from "keepalive-for-react";
import { Outlet } from "react-router-dom";

export default function() {
    // const aliveRef = useKeepAliveRef();

    return (
        <div>
            111
            <Outlet />
        </div>
        // <KeepAliveRouter target='/rca' aliveRef={aliveRef} />
    )
}