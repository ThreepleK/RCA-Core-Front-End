import { ConfigProvider } from 'antd';
import { _MENU } from './antd-compos'

/**
 * 테마 Provider
 */
export function AntdThemeProvider({ children }: {
    children: React.ReactNode
}) {
    return (
        <ConfigProvider theme={{
            components: {
                Menu: _MENU,
            },
            token: {
                motionDurationFast: '0.05s',
                motionDurationMid: '0.1s',
                motionDurationSlow: '0.2s',
            }
        }}>
            {children}
        </ConfigProvider>
    );
}