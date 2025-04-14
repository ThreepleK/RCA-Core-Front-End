import { useNavigate } from 'react-router-dom';

export default function(){
    const navigate = useNavigate();

    return <>
        <img src={`${$resourceUrl}/test.jpg`} />
        <button onClick={() => navigate('/test')}>이동하기</button>
    </>
}