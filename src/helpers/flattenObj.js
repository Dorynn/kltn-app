export default function flattenObj({ obj, parent, res = {} }) {
    const toReturn = {};

    for (const i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        if ((typeof obj[i]) == 'object' && obj[i] !== null) {
            const flatObject = flattenObj({ obj: obj[i] });
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[x] = flatObject[x];
            }
        } else {
            toReturn[i] = obj[i];
        }
    }
    return toReturn;
}