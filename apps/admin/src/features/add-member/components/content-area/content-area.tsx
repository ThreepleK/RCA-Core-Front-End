
import style from "./content-area.module.css";
import { MemberGrid } from "../member-grid/member-grid";
import { SelectedArea } from "../selected-area/selected-area";

export function ContentArea() {

    return (
        <div className={style["cont-area"]}>
            <div className={style["left-panel"]}><MemberGrid /></div>
            <div className={style["right-panel"]}><SelectedArea /></div>
        </div>
    );
}

