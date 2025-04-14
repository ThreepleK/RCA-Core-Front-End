import { Badge, NavLink } from '@mantine/core';
import { IconHome2, IconGauge, IconChevronRight, IconActivity, IconCircleOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const MainMenu = () => {
    const navigate = useNavigate();

    return <>
        <div className='flex flex-col gap-0 items-center justify-center'>
            <NavLink
                label="Dashboard"
                leftSection={<IconHome2 size={16} stroke={1.5} />}
                onClick={() => navigate('/')}
            />
            <NavLink
                label="Rca"
                leftSection={<IconHome2 size={16} stroke={1.5} />}
                onClick={() => navigate('/rca')}
            />
        </div>
    </>
}