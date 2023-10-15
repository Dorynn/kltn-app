import supabase from '../../supabaseClient';

export default async function downloadFile({ pathname, folder = 'assignments' }) {
    try {
        const { data, error } = await supabase
            .storage
            .from(folder)
            .createSignedUrl(pathname, 300, {
                download: true,
            })
        return { data, error };
    } catch (error) {
        return error;
    }
}
