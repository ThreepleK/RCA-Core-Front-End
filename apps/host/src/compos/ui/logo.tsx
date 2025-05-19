const logoPath = `/logo.png`;

export const Logo = () => {
    return (
        <div className='flex items-center justify-center px-2'>
            <img src={logoPath} className='h-[24px]' />
        </div>
    );
}