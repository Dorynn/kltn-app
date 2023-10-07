export default function flattenObj({ obj, parent, res = {} }) {
    const toReturn = {};

    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        if ((typeof obj[key]) === 'object' && obj[key] !== null) {
            const flatObject = flattenObj({ obj: obj[key] });
            for (const subKey in flatObject) {
                if (!flatObject.hasOwnProperty(subKey)) continue;

                toReturn[subKey] = flatObject[subKey];
            }
        } else {
            toReturn[key] = obj[key];
        }
    }
    return toReturn;
}