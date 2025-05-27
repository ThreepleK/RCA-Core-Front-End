import { useSendSelectedItem } from "../../stores";
import { Grid } from "../grid";

export function Members(){
    const {selectedItem } = useSendSelectedItem(s => s);

     //* 선택된 메뉴가 없을 때
    if( selectedItem === null ){
        return <>Please select the team on the left.</>;
    }
    return (
        <Grid />
    );
}
