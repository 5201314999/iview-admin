import Basic from '@/views/demo/basic/Main';
import BasicForm from '@/views/demo/basic/Form';
import BasicTable from '@/views/demo/basic/Table';
import BasicCascader from '@/views/demo/basic/Cascader';
import BasicDatePicker from '@/views/demo/basic/DatePicker';
import BasicTimePicker from '@/views/demo/basic/TimePicker';
import BasicPagination from '@/views/demo/basic/Pagination';

export default {
    path: 'basic',
    meta: {name: '基础组件'},
    component: Basic,
    children: [
        {path: '/', component: BasicForm, redirect: '/basic/form'},
        {path: 'form', component: BasicForm, name: 'Form 表单'},
        {path: 'table', component: BasicTable, name: 'Table 表格'},
        {path: 'cascader', component: BasicCascader, name: 'Cascader 级联选择'},
        {path: 'date', component: BasicDatePicker, name: 'DatePicker 日期选择'},
        {path: 'time', component: BasicTimePicker, name: 'TimePicker 时间选择'},
        {path: 'pagination', component: BasicPagination, name: 'Page 分页'}
    ]
}
