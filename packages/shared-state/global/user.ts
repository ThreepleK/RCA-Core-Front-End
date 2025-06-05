import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initLeader4Login, resignLeader, loginSendMsg, logoutSendMsg } from './utils/refresh-token';

//* 로그인 사용자 정보
export interface User {
    id: string;    
    username: string;    
    fullName: string;    
    email: string;
    roles: {
        id: string;
        name: string;
    }[]
}

//* 사용자 정보 상태
interface UserState {
    // state
    user: User|null;                    // 로그인 사용자 정보
    token: string|null;                 // 토큰
    expiresIn: number|null;             // 토큰 업데이트 시간
    
    // action
    isAdmin: ()=>boolean;               // 사용자가 관리자인지 확인 여부
    login: (                            // 로그인 사용자 정보 설정
        user: User,
        token: string,
        expiresIn: number,
    ) => void;
    logout: () => void;                 // 로그아웃
    isLogin: () => boolean;             // 로그인 여부
    updateToken: (                      // 토큰 업데이트
        token: string|null,     
        expiresIn: number|null,
    ) => void;            
}

//* 엑세스 토근 기록 용 
const _SESSION = sessionStorage;
const setAccessData = (data: any) => _SESSION.setItem('access-data', JSON.stringify(data));
const rmAccessData = () => _SESSION.removeItem('access-data');

//* 사용자 정보 store
export const useUserStore = create<UserState>()(
    persist((set, get) => ({
        user: null,
        token: null,
        expiresIn: null,

        // 관리자 여부 확인
        isAdmin: () => {
            const id = get()?.user?.username ?? '';
            return id === 'admin';
        },

        // 로그인 처리
        login: (user, token, expiresIn) => {

            // 인증 토큰 기록
            setAccessData({token, expiresIn});
            
            // 로그인 이후 리더 시작, 로그인 전달 (시작 전 인증 토큰이 있어야 함)
            initLeader4Login();
            loginSendMsg();

            // 로그인 정보 설정
            set({ user, token });
        },

        // 로그아웃 처리
        logout: () => {
            // 인증 토큰 제거
            rmAccessData();

            // 로그아웃 처리
            set({ user: null, token: null, expiresIn: null });

            // 리더 해제, 로그아웃 전달
            resignLeader();
            logoutSendMsg();
        },

        // 로그인 여부
        isLogin: () => !!get().user,

        // 토큰 업데이트
        updateToken: (token, expiresIn) => set({ token, expiresIn })
    }), {
        name: 'user-storage'
    })
);