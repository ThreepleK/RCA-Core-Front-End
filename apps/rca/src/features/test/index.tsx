import { useRouterStore } from '@repo/shared-state';

export default function(){
    const { pageMove } = useRouterStore(s => s);

    return <>
        <img src={`${$resourceUrl}/test.jpg`} />
        test
        <button onClick={() => pageMove({
            label: 'rca',
            path: '/rca',
            type: 'tab',
        })}>Back</button>
    </>
}