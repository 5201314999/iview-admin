import Basic from '@/views/demo/basic/Main';
import BasicForm from '@/views/demo/basic/Form';
import BasicTable from '@/views/demo/basic/Table';
import BasicPagination from '@/views/demo/basic/Pagination';

export default {
    path: 'basic',
    meta: {name: '基础组件'},
    component: Basic,
    children: [
        {path: '/', component: BasicForm, redirect: '/basic/form'},
        {path: 'form', component: BasicForm, name: 'Form 表单'},
        {path: 'table', component: BasicTable, name: 'Table 表格'},
        {path: 'pagination', component: BasicPagination, name: 'Page 分页'}
    ]
}
