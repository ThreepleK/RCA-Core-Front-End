import { TeamSwitcher } from "@/compos/ui/team-switcher";
import { useMainMenuStore } from '@repo/shared-state'

export function AppSidebar(){
    const isOpen = useMainMenuStore((state) => state.isOpen());
    
    return <>
        { isOpen && <TeamSwitcher /> }
    </>;
}