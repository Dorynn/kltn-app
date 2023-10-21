import { Upload, Progress } from "antd";
import supabase from '../../../src/supabaseClient';
import { useState } from 'react'

export default function SampleImportUsers() {
    const [defaultFileList, setDefaultFileList] = useState([]);

    const uploadFile = async options => {
        const { onSuccess, onError, file } = options;
        const fmData = new FormData();
        fmData.append("files", file);

        try {
            const { error } = await supabase.functions.invoke('import-bulk-users', {
                method: 'POST',
                body: fmData
            })

            if (error) {
                return console.log('*** upload error ***', error);
            }
            onSuccess("Ok");
        } catch (err) {
            console.log("Error: ", err);
            onError({ err });
        }
    };

    const handleOnChange = ({ file, fileList, event }) => {
        setDefaultFileList(fileList);
    };

    return (
        <Upload
            customRequest={uploadFile}
            onChange={handleOnChange}
            listType="picture-card"
            defaultFileList={defaultFileList}
            className="image-upload-grid"
        >
            {defaultFileList.length >= 1 ? null : <div>Import bulk user</div>}
        </Upload>
    );
};