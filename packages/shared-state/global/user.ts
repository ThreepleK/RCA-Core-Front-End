import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//* 로그인 사용자 정보
interface User {
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
    token: string|null;                 // 로그인 토큰
    
    // action
    login: (user: User, token: string) => void;     // 로그인 사용자 정보 설정
    logout: () => void;                             // 로그아웃
    isLogin: () => boolean;                         // 로그인 여부
}

//* 사용자 정보 store
export const useUserStore = create<UserState>()(
    persist((set, get) => ({
        user: null,
        token: null,

        login: (user, token) => set({ user, token }),
        logout: () => set({ user: null, token: null }),
        isLogin: () => !!get().user,
    }), {
        name: 'user-storage'
    })
);