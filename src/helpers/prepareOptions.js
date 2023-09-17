export default function prepareOptions({
    labelField,
    valueField,
    data = [],

}) {
    return data.map(item => ({ label: item[labelField], value: item[valueField] }));
}