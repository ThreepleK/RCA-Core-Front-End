/**
 * 구간 store
 */
export class SectionStore {
    evList = {};

    /**
     * 등록 이벤트
     * @param key 등록 이벤트 키
     * @param callback 전달 받을 함수
     */
    on( key: string, callback: (args: any) => void ){
        if( key in this.evList ){ return; }
        this.evList[key] = callback;
    }

    /**
     * 제거 이벤트
     * @param key 제거 이벤트 키
     */
    off( key: string ){
        if( !(key in this.evList) ){ return; }

        this.evList[key] = null;
        delete this.evList[key];
    }

    /**
     * 이벤트 전달
     * @param key 이벤트 키
     * @param data 전달 데이터
     */
    trigger( key: string, data?: any ){
        if( !(key in this.evList) ){ return; }
        this.evList[key](data);
    }

    /**
     * 동시 이벤트 전달
     * @param tList 트리거 리스트
     */
    triggers(tList: {[key: string]: any} ){
        for( const key in tList ){
            this.trigger(key, tList[key]);
        }
    }

    /**
     * 이벤트 전달 피드백
     * @param key 이벤트 키
     * @param data 전달 데이터
     * @return 콜백 된 데이터
     */
    feedback( key: string, data: any ): any {
        if( !(key in this.evList) ){ return null; }
        return this.evList[key](data);
    }

    /**
     * 등록된 이벤트 전체 제거
     */
    destroy(){
        for( const key in this.evList ){
            this.off(key);
        }
    }
}