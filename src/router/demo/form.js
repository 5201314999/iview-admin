import Form from '@/views/demo/form/Main';
import FormInput from '@/views/demo/form/Input';
import FormTable from '@/views/demo/form/Table';

export default {
    path: 'form',
    meta: {name: '表单'},
    component: Form,
    children: [
        {path: '/', component: FormInput, redirect: '/form/input'},
        {path: 'input', component: FormInput, name: 'Input 输入框'},
        {path: 'table', component: FormTable, name: 'Table 表格'}
    ]
}
