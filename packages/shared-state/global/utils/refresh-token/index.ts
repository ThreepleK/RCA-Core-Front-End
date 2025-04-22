import { useUserStore } from '../..';
import { v4 as uuidv4 } from 'uuid';

// @ts-ignore
import workerJSCode from './worker/refresh-token.js?raw'

//* 같은 origin 내의 탭 끼리 양방향 통신 용
const _CHANNEL = new BroadcastChannel('auth-refresh-token');

let _LEADER_ID = uuidv4();      //* 리더 ID
let _LEADER_CHANGE_TIME = 0;    //* 리더 교체에 들어간 시간

// 디버깅 용
// sessionStorage.setItem('tab-id', _LEADER_ID);
// console.log('TAB-ID', _LEADER_ID);

//* 리더 탭 관련
const leaderTab = new (class {
    #storage = localStorage;    // 리더 탭 될 스토리지 설정
    #key = 'leader-tab';        // 리더 탭 전용 키 값

    // 현재 탭 리더 여부
    isLeader(){
        const leaderChk = (delay: number = 100) => {
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {

                    const id = this.getID();

                    if( id.length === 0 ){
                        resolve(false);
                    }

                    // 리더로 되어 있지만 우선순위 id에 지정되어 있는지 확인
                    resolve(_LEADER_ID === id[0]);
                }, delay);
            });
        }

        return new Promise<boolean>(async (resolve) => {
            const loopLen = 3;
            let chkCnt = 0;

            for( let i = 0; i < loopLen; i++ ){
                const delay = Math.random() * 1000;
                const is = await leaderChk(delay);

                if( !is ){ continue; }
                chkCnt++;
            }

            // console.log('chkCnt', chkCnt);

            resolve(loopLen === chkCnt);
        });
    }

    // 현재 리더 탭 ID 설정
    setID(id: string){
        const idList = this.getID();
        idList.push(id);

        this.#storage.setItem(this.#key, JSON.stringify(idList));
    }

    // 현재 리터 탭 ID 가져오기
    getID(){
        const data = this.#storage.getItem(this.#key);

        if( data === undefined || data === null || data === '' ){
            return JSON.parse('[]');
        }

        return JSON.parse(data as any);
    }

    // 현재 리터 탭 ID 제거
    rmID(){
        this.#storage.removeItem(this.#key);
    }

    // 리더 인수 (*여러 탭 동시에 처리 됨)
    takeOverLeader(callback: (delay: number)=>void){
        // 동시에 위임 받지 않기 위해서 랜덤 시간 부여
        const delay = 100 + (Math.random() * 2000);

        setTimeout(() => {
            // 현재 리더가 누구인지 가져오기
            const currLeader = leaderTab.getID();

            // 이미 정해져 있다면 건너 뜀
            if( currLeader.length > 0 ){ return; }
            
            // 리더 탭 위임 받는데 지연 된 시간 전달
            callback(delay);
        }, delay);
    }
})();

//* 접근 가능 데이터 (인증 토큰)
const accessData = new (class{
    #storage = sessionStorage;    // 인증토큰 데이터 스토리지 설정
    #key = 'access-data';         // 인증토큰 데이터 전용 키 값

    // 아이템 설정
    setItem(data: any){
        this.#storage.setItem(this.#key, JSON.stringify(data));
    }

    // 아이템 가져오기
    getItem(){
        const data = this.#storage.getItem(this.#key);
        return JSON.parse(data ?? '{}');
    }
})();

//* 워커 설정
const worker = new (class{

    #worker: Worker|null = null;
    #onMsgs: any = {};
    #onMessageHook: any = () => {};

    // 워커 동작 여부
    isRunning(){
        return this.#worker !== null;
    }

    // 워커 만들기
    createWorker(){
        // 워커 불러오기
        const workerCode = URL.createObjectURL(new Blob(
            [ workerJSCode ],
            { type: 'text/javascript' }
        ));

        this.#worker = new Worker(workerCode, { type: 'module' });

        // 워커에서 받아온 메시지 전달
        this.#worker.onmessage = (e: MessageEvent) => {
            const {type, data} = e.data;

            this.#onMessageHook();

            if( !(type in this.#onMsgs) ){ return; }

            this.#onMsgs[type](data);
        }
    }
    
    // 워커에 메시지 전달
    sendMessage(method: string, args: any){
        if( this.#worker === null ){ return; }
        this.#worker.postMessage({method, args});
    }

    // onmessage 초기 훅 설정
    setOnMessageHook(callback: any){
        // 콜백 함수가 아니면 추가 안함
        if( typeof callback !== 'function' ){ return; }
        this.#onMessageHook = callback;
    }

    // 워커를 통해 받을 메시지 설정
    addReceiveCallback(type: string, callback: any){
        // 콜백 함수가 아니면 추가 안함
        if( typeof callback !== 'function' ){ return; }
        this.#onMsgs[type] = null;
        this.#onMsgs[type] = callback;
    }

    // 워커를 통해 받을 메시지 제거
    rmReceiveCallback(type: string){
        // 관련 콜백 함수가 아니면 삭제 안함
        if( !(type in this.#onMsgs) ){ return; }

        this.#onMsgs[type] = null;
        delete this.#onMsgs[type];
    }

    // 워커를 통해 받을 메시지 전체 제거
    allRmReceiveCallback(){
        for( const key in this.#onMsgs ){
            this.#onMsgs[key] = null;
            delete this.#onMsgs[key];
        }
    }

    // 워커 정지
    stop(){
        if( this.#worker === null ){ return; }
        
        this.#worker.terminate();
        this.#worker = null;

        this.allRmReceiveCallback();
    }
    
})();


//* 채널 메시지
_CHANNEL.onmessage = (e: MessageEvent) => {
    const {type, data} = e.data;

    switch( type ){
        //* 리더가 닫힘, 인계 대상 설정
        case 'LEADER_CLOSE': {
            // 내 탭이 리더 탭으로 인수 대상일 때
            leaderTab.takeOverLeader((delay) => {
                // 리더 교체에 들인 시간 가져오기
                _LEADER_CHANGE_TIME = delay;
        
                // 리더 시작
                becomeLeader();
            });
        } break;

        //* 토큰 업데이트
        case 'TOKEN_UPDATE': {
            const {token, expiresIn} = data;

            // console.log('리더 -> 토큰 업데이트', token);

            // 리더 브라우저 탭 상태에서 보내준 토큰 정보 업데이트
            accessData.setItem({token, expiresIn});
        }; break;

        //* 로그인
        case 'LOGIN': {
            // 다른 탭에서 로그인 되었을 때
            if( /^\/sign-in/gi.test(window.location.pathname) ){
                // 로그인 상태 업데이트 시간 이후 -> 메인 페이지로 강제 이동
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        }; break;

        //* 로그아웃
        case 'LOGOUT': {
            // 혹시라도 동작하고 있을 워커 로그아웃 신호 전달
            worker.sendMessage('logout', {});
            // 로그인 페이지로 강제 이동
            window.location.href = '/sign-in';
        }; break;
    }
}

/**
 * 리프레시 토큰 워커 실행
 */
async function startWorker(){
    // 이미 워커가 동작 중이면 처리 안함
    if( worker.isRunning() ){ return; }

    // 리더가 아니면 시작 안함
    if( !await leaderTab.isLeader() ){ return; }

    // 워커 만들기
    worker.createWorker();

    // 토큰 값 가져오기
    const {token, expiresIn} = accessData.getItem();

    // [탭 → 워커] 리프레시 토큰 시작 전달
    worker.sendMessage('refresh-start', {
        token,
        loopTime: expiresIn * 1000,          // 리프레시 반복 서버 시간
        // loopTime: 15 * 1000,              // 리프레시 반복 고정 시간 
        correctTime: -(10 * 1000),           // 리프레시 보정 시간 (반복 - 보정)
        changeTime: _LEADER_CHANGE_TIME,     // 탭 변경 시 지연시간
    });

    // [워커 → 탭] onmessage 훅
    worker.setOnMessageHook(async () => {
        // 리더가 아닌데 동작 할 경우 처리 안함
        if( !await leaderTab.isLeader() ){
            // 워커 정지
            worker.stop();
            return true;
        }

        // 로그인 상태가 아니면 
        if( !useUserStore.getState().isLogin() ){
            // 현재 브라우저 탭 로그아웃 처리
            useUserStore.getState().logout();
        }

        return false;
    });

    // [워커 → 탭] 신규 토큰
    worker.addReceiveCallback('NEW-TOKEN', (data: any) => {
        const {token, expiresIn} = data;

        // 세션 스토리지 등록
        accessData.setItem({token, expiresIn});

        // 현재 브라우저 탭 상태 업데이트
        useUserStore.getState().updateToken(token, expiresIn);

        // console.log('신규 토큰', token);

        // 다른 브라우저 탭 업데이트 내용 전달
        _CHANNEL.postMessage({
            type: 'TOKEN_UPDATE',
            data: { token, expiresIn }
        });
    });

    // [워커 → 탭] 로그아웃
    worker.addReceiveCallback('LOGOUT', () => {
        // 현재 브라우저 탭 로그아웃 처리
        useUserStore.getState().logout();
        // 다른 브라우저 탭 로그아웃 내용 전달
        _CHANNEL.postMessage({
            type: 'LOGOUT',
        });
    });
}

/**
 * 리프레시 토큰 워커 정지처리
 */
function stopWorker(){
    if( !worker.isRunning() ){ return; }
    
    // 워커 정지
    worker.stop();

    // 리더 탭 id 제거
    leaderTab.rmID();

    // 다른 탭에 신호 전달
    _CHANNEL.postMessage({
        type: 'LEADER_CLOSE',
        data: {}
    })
}

/**
 * 리더 - 시작
 */
async function becomeLeader(){
    // 리더면 건너 뜀
    if( await leaderTab.isLeader() ){ return; }

    // 리더 탭 id 설정
    leaderTab.setID(_LEADER_ID)

    // 리프레시 토큰 스케쥴 시작
    startWorker();
}

/**
 * 로그인
 */
export function loginSendMsg(){
    // 다른 브라우저 탭 로그인 내용 전달
    _CHANNEL.postMessage({
        type: 'LOGIN',
    });
}

/**
 * 로그아웃
 */
export function logoutSendMsg(){
    // 다른 브라우저 탭 로그아웃 내용 전달
    _CHANNEL.postMessage({
        type: 'LOGOUT',
    });
}

/**
 * 리더 - 정지
 */
export function resignLeader(){
    leaderTab.rmID();

    // 리프레시 토큰 스케쥴 정지
    stopWorker();
}

/**
 * 리더 init (로그인 용)
 */
export function initLeader4Login(){
    // 이미 로그인 중에 강제 리더 설정 하려 할 경우 제외
    if( useUserStore.getState().isLogin() ){ return; }

    // 리더 탭 시작
    becomeLeader();

    //* 탭 닫힘, 리더 정리
    window.addEventListener('unload', resignLeader);
}


/**
 * 리더 init (초기 페이지 접근 용)
 */
export async function initLeader(){
    // 현재 탭이 리더라면 건너 뜀
    if( await leaderTab.isLeader() ){ return; }

    // 로그인 여부
    const isLogin = useUserStore.getState().isLogin();

    // 리더 권한이 있을 경우
    const getAccess = leaderTab.getID().length === 0 || leaderTab.isLeader();

    // 로그인 && 리더 탭이 공석일 경우, 리더 재설정
    if( isLogin && getAccess ){
        // 내 탭이 리더 탭으로 인수 대상일 때
        leaderTab.takeOverLeader((delay) => {
            // 리더 교체에 들인 시간 가져오기
            _LEADER_CHANGE_TIME = delay;
    
            // 리더 시작
            becomeLeader();
        });
    }

    //* 탭 닫힘, 리더 정리
    window.addEventListener('unload', resignLeader);
}
