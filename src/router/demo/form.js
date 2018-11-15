import Form from '@/views/demo/form/Main';
import FormInput from '@/views/demo/form/Input';

export default {
    path: 'form',
    name: '表单',
    component: Form,
    children: [
        {path: 'input', component: FormInput, name: 'Input 输入框'}
    ]
}
