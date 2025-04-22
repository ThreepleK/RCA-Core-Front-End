import { Logo } from "../ui/logo";
import { TeamSwitcher } from "../ui/team-switcher";
import { useMainMenuStore } from '@repo/shared-state'

export default function AppSidebar(){
    const isOpen = useMainMenuStore((state) => state.isOpen());
    
    return <>
        <Logo />
        { isOpen && <TeamSwitcher /> }
    </>;
}