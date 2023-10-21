// convert sang option cho select antd
export default function prepareOptions({
    labelField, // label hiển thị
    valueField, // value
    data = [], // data
    prefix, // key hiển thị nếu hiển thị kiểu key - name
    subfix, // name hiển thị nếu hiển thị kiểu key - name
}) {
    return data.map(item => ({ label: `${prefix || ''}${item[labelField] || ''} - ${item[subfix] || ''}`, value: item[valueField] }));
}