import supabase from '../../supabaseClient';

export default async function downloadFile({ pathname, folder }) {
    console.log('pathname', pathname)
    const { data, error } = await supabase
        .storage
        .from(folder)
        .createSignedUrl(pathname, 300, {
            download: true,
        })
    if (error) {
        console.log('download error', error)
    }
    window.open(data.signedUrl)
}
