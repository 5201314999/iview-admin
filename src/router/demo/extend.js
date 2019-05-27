import Extend from '@/views/demo/extend/Main';
import ExtendUpload from '@/views/demo/extend/Upload';
import ExtendTransfer from '@/views/demo/extend/Transfer';

export default {
    path: 'extend',
    meta: {name: '扩展组件'},
    component: Extend,
    children: [
        {path: '/', component: ExtendUpload, redirect: '/extend/upload'},
        {path: 'upload', component: ExtendUpload, name: 'Upload 上传'},
        {path: 'transfer', component: ExtendTransfer, name: 'Transfer 穿梭框'},
    ]
}
