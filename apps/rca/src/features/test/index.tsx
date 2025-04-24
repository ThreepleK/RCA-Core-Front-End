import { useNavigate } from 'react-router-dom';

export default function(){
    const navigate = useNavigate();

    return <>
        <img src={`${$resourceUrl}/test.jpg`} />
        test
        <button onClick={() => navigate('/')}>Back</button>
    </>
}