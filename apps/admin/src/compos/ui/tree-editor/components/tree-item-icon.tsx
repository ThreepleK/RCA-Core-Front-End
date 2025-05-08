import { IconFile, IconFolder, IconFolderOpen } from "@tabler/icons-react";

/**
 * Tree 아이템
 * 왼쪽 아이콘
 */
export function TreeItemIcon({ isFolder, collapsed }: {
    isFolder: boolean;      // 폴더 여부
    collapsed: boolean;     // 접힘 여부
}) {  
    if (isFolder) {
        return collapsed
            ? <IconFolder size={16} stroke={1.25} />        // 폴더 접힘
            : <IconFolderOpen size={16} stroke={1.25} />    // 폴더 펼침
        ;
    }
  
    return <IconFile size={16} stroke={1.25} />;            // 파일
}