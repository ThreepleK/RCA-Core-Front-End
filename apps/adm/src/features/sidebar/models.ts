    export interface IFetchSidebarMenu {
        id: string;
        name: string;
        displayName: string;
        menus: IFetchSidebarMenuItem[];
    }
    
    export interface IFetchSidebarMenuItem {
        name: string;
        id: string;
        displayName: string;
        level: number;
        url: string;
        sortOrder: number;
        isVisible: boolean;
        isActive: boolean;
        openInNewTab: boolean;
        applicationId?: string;
        licenseId?: string;
        menuGroupId?: string;
        itemType?: string;
    }
    
    export interface DataType {
        key: string;
        name: string;
        displayName: string;
        isVisible: boolean;
    }