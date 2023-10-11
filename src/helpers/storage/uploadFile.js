import supabase from '../../supabaseClient';

export default async function uploadFile({ file, folder, user }) {
    try {
        const { data, error } = await supabase
            .storage
            .from(folder)
            .upload(`${user.auth_id}/${file.name}`, file, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            return console.log('supabase upload error', error);
        }
        console.log("upload file path", data.path);
    } catch (err) {
        console.log("Eroor: ", err);
    }
};
