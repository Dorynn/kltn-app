import supabase from '../../supabaseClient';

export default async function uploadFile({ file = 'assignments', folder, user }) {
    try {
        const { data, error } = await supabase
            .storage
            .from(folder)
            .upload(`${user.auth_id}/${file.name}`, file, {
                cacheControl: '3600',
                upsert: false
            })
        return { data, error };
    } catch (err) {
        return err;
    }
};
