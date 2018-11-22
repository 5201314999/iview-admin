<template>
    <Row class="layout-datepicker">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-create-outline" />
                <a href="https://www.iviewui.com/components/date-picker" target="_blank">Date Picker</a>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( normal )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="date" placeholder="请选择日期" size="large"></DatePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( range )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期范围" size="large"></DatePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label" title="multiple">日期选择 ( multiple )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="date" placeholder="请选择日期" size="large" multiple></DatePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( time )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="datetimerange" placeholder="请选择日期范围" size="large" class="wi-date-picker-range"></DatePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label" title="shortcuts">日期选择 ( shortcuts )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="date" :options="options" placeholder="请选择日期" size="large"></DatePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label" title="shortcuts">日期选择 ( disabled )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="date" :options="disabled" placeholder="请选择日期" size="large"></DatePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label" title="Year Or Month">日期选择 ( Year Or Month )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-date-picker">
                        <DatePicker type="year" placeholder="请选择年份" size="large"></DatePicker>
                        <DatePicker type="month" placeholder="请选择月份" size="large" class="ml20"></DatePicker>
                    </Row>
                </Row>
            </Row>
        </Card>
        <Card class="mt20">
            <Row slot="title" class="wi-card-title">
                <icon type="ios-code-working" /> 代码
            </Row>
            <pre v-highlight><code>{{ html }}</code></pre>
        </Card>
    </Row>
</template>
<script>
    const DatePickerComponent = {
        data() {
            return {
                form: {
                    validate: {},
                    rules: {}
                },
                options: {
                    shortcuts: [{
                        text: '今天',
                        value() {return new Date();}
                    }, {
                        text: '昨天',
                        value() {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            return date;
                        }
                    }, {
                        text: '一周',
                        value () {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            return date;
                        }
                    }]
                },
                disabled: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                html: '<template>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( normal )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="date" placeholder="请选择日期" size="large"></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( range )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期范围" size="large"></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label" title="multiple">日期选择 ( multiple )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="date" placeholder="请选择日期" size="large" multiple></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( time )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="datetimerange" placeholder="请选择日期范围" size="large" class="wi-date-picker-range"></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label" title="shortcuts">日期选择 ( shortcuts )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="date" :options="options" placeholder="请选择日期" size="large"></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label" title="shortcuts">日期选择 ( disabled )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="date" :options="disabled" placeholder="请选择日期" size="large"></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label" title="Year Or Month">日期选择 ( Year Or Month )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-date-picker">\n' +
                    '                <DatePicker type="year" placeholder="请选择年份" size="large"></DatePicker>\n' +
                    '                <DatePicker type="month" placeholder="请选择月份" size="large" class="ml20"></DatePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '</template>\n' +
                    '<script>\n' +
                    '    const DatePickerComponent = {\n' +
                    '        data() {\n' +
                    '            return {\n' +
                    '                form: {\n' +
                    '                    validate: {},\n' +
                    '                    rules: {}\n' +
                    '                },\n' +
                    '                options: {\n' +
                    '                    shortcuts: [{\n' +
                    '                        text: \'今天\',\n' +
                    '                        value() {return new Date();}\n' +
                    '                    }, {\n' +
                    '                        text: \'昨天\',\n' +
                    '                        value() {\n' +
                    '                            const date = new Date();\n' +
                    '                            date.setTime(date.getTime() - 3600 * 1000 * 24);\n' +
                    '                            return date;\n' +
                    '                        }\n' +
                    '                    }, {\n' +
                    '                        text: \'一周\',\n' +
                    '                        value () {\n' +
                    '                            const date = new Date();\n' +
                    '                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);\n' +
                    '                            return date;\n' +
                    '                        }\n' +
                    '                    }]\n' +
                    '                },\n' +
                    '                disabled: {\n' +
                    '                    disabledDate(date) {\n' +
                    '                        return date && date.valueOf() < Date.now() - 86400000;\n' +
                    '                    }\n' +
                    '                }\n' +
                    '            };\n' +
                    '        }\n' +
                    '    };\n' +
                    '    export default DatePickerComponent;\n' +
                    '<\/script>'
            };
        }
    };
    export default DatePickerComponent;
</script>
