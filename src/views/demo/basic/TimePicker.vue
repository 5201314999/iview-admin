<template>
    <Row class="layout-time-picker">
        <Card>
            <Row slot="title" class="wi-card-title">
                <icon type="ios-create-outline" />
                <a href="https://www.iviewui.com/components/time-picker" target="_blank">Time Picker</a>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( normal )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-time-picker">
                        <TimePicker type="time" placeholder="请选择时间" size="large"></TimePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( range )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-time-picker">
                        <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间范围" size="large"></TimePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( format )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-time-picker">
                        <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间范围" size="large" format="HH:mm"></TimePicker>
                    </Row>
                </Row>
            </Row>
            <Row class="wi-item">
                <Row class="wi-item-label">日期选择 ( step )</Row>
                <Row class="wi-item-content">
                    <Row class="wi-time-picker">
                        <TimePicker type="time" placeholder="请选择时间" size="large" :steps="[1, 15, 15]"></TimePicker>
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
    const TimePickerComponent = {
        data() {
            return {
                html: '<template>\n' +
                    '    <Row slot="title" class="wi-card-title">\n' +
                    '        <icon type="ios-create-outline" />\n' +
                    '        <a href="https://www.iviewui.com/components/time-picker" target="_blank">Time Picker</a>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( normal )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-time-picker">\n' +
                    '                <TimePicker type="time" placeholder="请选择时间" size="large"></TimePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( range )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-time-picker">\n' +
                    '                <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间范围" size="large"></TimePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( format )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-time-picker">\n' +
                    '                <TimePicker type="timerange" placement="bottom-end" placeholder="请选择时间范围" size="large" format="HH:mm"></TimePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '    <Row class="wi-item">\n' +
                    '        <Row class="wi-item-label">日期选择 ( step )</Row>\n' +
                    '        <Row class="wi-item-content">\n' +
                    '            <Row class="wi-time-picker">\n' +
                    '                <TimePicker type="time" placeholder="请选择时间" size="large" :steps="[1, 15, 15]"></TimePicker>\n' +
                    '            </Row>\n' +
                    '        </Row>\n' +
                    '    </Row>\n' +
                    '</template>'
            };
        }
    };
    export default TimePickerComponent;
</script>
