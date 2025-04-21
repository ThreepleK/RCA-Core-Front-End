/**
 * 토큰 리프레시를 위한 Worker
 */

//* 외부에서 접근 할 함수 설정
const _CONNECT_FN = {
    'refresh-start': refreshStart
};

//* 스케쥴 용 interval
let _SCHEDULE_INTERVAL;

/**
 * 외부에서 전달 온 메시지 이벤트
 * @param {Object} e             MessageEvent
 * @param {Object} e.data        MessageEvent에 담겨올 데이터
 * @param {string} e.data.method 처리 할 메소드 명
 * @param {*} e.data.args        메소드에 넘겨쥴 인자 데이터
 */
self.onmessage = (e) => {
    const {method, args} = e.data;

    // 사용 가능한 함수가 아니면 처리 안함
    if( !(method in _CONNECT_FN) ){ return; }

    // 워커 내의 선언된 함수 전달
    _CONNECT_FN[method](...[args]);
}

/**
 * 외부에 전달 용
 * @param {string} key 전달 받을 타입
 * @param {*} data 타입에 따른 데이터
 */
function sendResponse(key, data){
    self.postMessage({type: key, data});
}

/**
 * 토큰 업데이트
 * @param {string} token 인증 요청 토큰
 * @param {number} loopTime 리프레시 요청 반복 시간
 * @param {number} correctTime 리프레시 요청 보정 시간
 * @param {number} changeTime 리더 탭이 변경 되면서 지연된 시간
 */
function refreshStart({token, loopTime, correctTime, changeTime}){

    // 진행중인 스케쥴이 있으면 제거
    clearTimeout(_SCHEDULE_INTERVAL);

    //* 스케쥴 설정
    const oneTimeSchedule = async () => {
        try {
            const { origin } = self.location;

            // 리프레시 요청
            const res = await fetch(origin+'/auth/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token,
                },
            });

            //* 토큰 리프레시에 실패 했을 경우
            if( res.status !== 200 ){
                throw new Error('Refresh token update failed.');
            }

            //* 성공적으로 토큰을 받았을 경우
            const {accessToken, expiresIn} = await res.json();

            // 토큰 정보 전달
            sendResponse('NEW-TOKEN', {
                token: accessToken,
                expiresIn,
            });

            // 받은 시간 기준으로 재시작
            refreshStart({
                token: accessToken, 
                loopTime: expiresIn * 1000,  // 서버에서 다시 준 유효 시간
                // loopTime: loopTime,  // 초기 반복 시간
                correctTime,
                changeTime: 0,
            });
        } catch(err) {
            console.log(err);
            sendResponse('LOGOUT');
        }
    };

    // 반복 처리할 시간 계산
    const time = parseInt((loopTime + correctTime) - changeTime, 10);

    //* 일정시간 이후에 스케쥴 동작
    _SCHEDULE_INTERVAL = setTimeout(oneTimeSchedule, time);
}