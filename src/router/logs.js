import Logs from '@/views/logs/Main';
import Login from '@/views/logs/Login';
import Operation from '@/views/logs/Operation';

export default {
    path: 'logs',
    meta: {name: '日志'},
    component: Logs,
    children: [
        {path: '/', component: Login, redirect: '/logs/login'},
        {path: 'login', component: Login, name: '登录日志'},
        {path: 'operation', component: Operation, name: '操作日志'}
    ]
}
