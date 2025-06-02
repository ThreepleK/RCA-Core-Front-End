import { ConfigProvider } from 'antd';
import { _INPUT, _MENU, _BUTTON } from './antd-compos'

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
                Input: _INPUT,
                Button: _BUTTON,
            },
            token: {
                //-- transition Fast, Mid, Slow 타입 별 속도
                motionDurationFast: '0.025s',
                motionDurationMid: '0.05s',
                motionDurationSlow: '0.10s',

                //-- 그림자 설정
                boxShadowSecondary: '0 1px 4px 0px rgba(0, 0, 0, 0.175)'
            }
        }}>
            {children}
        </ConfigProvider>
    );
}