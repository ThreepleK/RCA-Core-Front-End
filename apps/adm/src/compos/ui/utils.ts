/**
 * 속성에 ClassName 합치기
 * @param props 컴포넌트 속성
 * @param className 클래스명
 */
export function concatClassName(props: any, className: string){
    return ('className' in props && typeof props.className === 'string')
        ? `${className} ${props.className}`
        : className;
}