import { useState, useEffect } from 'react'

export default function useSupbaseAction({ defaultAction, firstLoad = true, initialData = {} }) {
    const [fetched, setFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [data, setData] = useState(initialData);
    const requestAction = async ({ action = defaultAction, successMessage = '' }) => {
        try {
            setSuccess(null);
            setError(null);
            setLoading(true)
            const { data, error } = await action();
            if (!fetched) {
                setFetched(true)
            }
            if (error) {
                setError({
                    message: error.message
                });
            } else {
                setSuccess({
                    message: successMessage
                });
                setData(data);
            }
        } catch (err) {
            setError({
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (firstLoad) {
            requestAction({});
        }
    }, [])
    return {
        fetched,
        loading,
        error,
        data,
        requestAction,
        success
    }
}