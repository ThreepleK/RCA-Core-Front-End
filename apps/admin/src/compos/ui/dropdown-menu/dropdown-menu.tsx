import { Button, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { ReactNode, useState } from "react";

/**
 * Dropdown 메뉴
 * @param label 버튼 이름
 * @param menuList 메뉴
 * @param onActions 메뉴 선택 이벤트
 */
export function DropdownMenu({ label, menuList, onActions }: {
    label: string;
    menuList: {key: string, label: string|ReactNode}[];
    onActions: (actionKey: string) => void;
}){
    const [opened, setOpened] = useState(false);

    return (
        <Menu
            opened={opened} onChange={setOpened}
            position='bottom-end' width={200}
            transitionProps={{transition: 'fade', duration: 100}}
        >
            {/* 버튼 */}
            <Menu.Target>
                <Button
                    variant="outline" size="xs" radius="md"
                    rightSection={<IconChevronDown size={14} />}
                >
                    {label}
                </Button>
            </Menu.Target>

            {/* 드랍다운 메뉴 */}
            <Menu.Dropdown>
                <Menu.Label>{label}</Menu.Label>
                {menuList.map((menu, idx) => (
                    <Menu.Item key={idx} onClick={()=>onActions(menu.key)}>{menu.label}</Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}