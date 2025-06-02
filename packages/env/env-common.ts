// 개발 주소
const _DEV_HOST = 'http://localhost';
// 운영 주소
const _PROD_HOST = 'http://localhost';
// 운영에서 사용 될 원격 기본 주소
const _PROD_HOST_REMOTE = `${_PROD_HOST}/r`;

export default {
    //* 메인 앱 개발/배포 주소
    mainAppHost: {
        development: `${_DEV_HOST}:5000`,
        production: `${_PROD_HOST}`,
    },

    //* 원격 앱 연결 키 값
    remoteAccessKey: {
        dashboard: 'dashboard',
        admin: 'admin',
        adm: 'adm',
    },

    //* 원격 앱 개발/배포 주소
    remoteAppHost: {
        development: {
            dashboard: `${_DEV_HOST}:5002`,
            admin: `${_DEV_HOST}:5009`,
            adm: `${_DEV_HOST}:5010`,
        },
        production: {
            dashboard: `${_PROD_HOST_REMOTE}/dashboard`,
            admin: `${_PROD_HOST_REMOTE}/admin`,
            adm: `${_PROD_HOST_REMOTE}/adm`,
        }
    },

    //* 원격 앱 연결 파일 명 (Module federation)
    mf_fileName: 'remoteEntry.js',

    //* 연결 시 사용 될 항목 (각 앱 경로 기준)
    exposeSync: {
        dashboard: {
            // './main': './src/App.tsx'
        },
        admin: {
            './router': './src/router/host.tsx'
        },
        adm: {
            './router': './src/router/host.tsx'
        }
    }
}