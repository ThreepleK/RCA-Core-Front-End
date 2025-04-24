import { useKeepAliveRef } from "keepalive-for-react";
import { KeepAliveRouter } from '@repo/core-ui'

export default function() {
    const aliveRef = useKeepAliveRef();

    return (
        <KeepAliveRouter target='/' aliveRef={aliveRef} />
    )
}