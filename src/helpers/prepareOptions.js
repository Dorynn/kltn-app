export default function prepareOptions({
    labelField,
    valueField,
    data = [],
    prefix,
    subfix
}) {
    return data.map(item => ({ label: `${prefix || ''}${item[labelField] || ''} - ${item[subfix] || ''}`, value: item[valueField] }));
}