const logoPath = `/logo.png`;

export const Logo = () => {
    return <div className='flex items-center justify-center bg-[#242424] py-2 rounded-md'>
        <img src={logoPath} className='w-[103px]' />
    </div>;
}