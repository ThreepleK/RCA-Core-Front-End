import { FC, ReactNode, ComponentType } from "react";

type Props = { children: ReactNode };
type ProviderComponent = [
    ComponentType<any>,
    Record<string, any>?
];
 
/**
 * Provider 합치기
 */
export function ProviderConcat(...providers: ProviderComponent[]): FC<Props> {
    return ({children}: Props) => (
        providers.reduceRight((acc, [Provider, props]) => (
            <Provider {...(props || {})}>{acc}</Provider>
        ), children)
    );
}

/**
 * ## 사용 예시
 * 
 * //* 그리드 Provider 설정
 * const AppProvider = ProviderConcat(
 *     [ThemeProvider, {mode: 'dark'}], // 테마
 *     [GridProvider],                  // 그리드 기본 설정 Store를 위한 Context
 *     [GridEventProvider]              // 그리드 이벤트 처리 Store를 위한 Context
 * );
 * 
 * //* 앱 컴포넌트
 * export function App(){
 *     return (
 *         <AppPrivider>
 *              <BasicTheme />    // 그리드 본문
 *              <GridInit />      // 그리드 초기 설정
 *              <GridEvents />    // 그리드 이벤트 처리
 *         </AppPrivider>
 *     );
 * }
 */