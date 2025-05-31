import type { ReactNode } from "react";

type Props = {
    order?: number;
    className?: string;
    children?: ReactNode
};

export function UI_Title({order=1, className, children}: Props){
    const Order = _ORDER[order];
    return <Order className={className}>{children}</Order>
}

const _ORDER = {
    1: H1, 2: H2, 3: H3, 4: H4, 5: H5, 6: H6,
}

function H1({children, className}: Props){
    return <h1 className={className}>{children}</h1>
}
function H2({children, className}: Props){
    return <h2 className={className}>{children}</h2>
}
function H3({children, className}: Props){
    return <h3 className={className}>{children}</h3>
}
function H4({children, className}: Props){
    return <h4 className={className}>{children}</h4>
}
function H5({children, className}: Props){
    return <h5 className={className}>{children}</h5>
}
function H6({children, className}: Props){
    return <h6 className={className}>{children}</h6>
}