import { useState, useEffect } from 'react'

export default function useSupbaseAction({ defaultAction, firstLoad = true, initialData = {}, deps =[] }) {
    const [fetched, setFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [data, setData] = useState(initialData);
    const [count, setCount] = useState(0)
    const requestAction = async ({ action = defaultAction, successMessage = '', params = {} }) => {
        try {
            setSuccess(null);
            setError(null);
            setLoading(true)
            const { data, error, count } = await action(params);
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
                setCount(count)
            }
        } catch (err) {
            setError({
                message: err.message
            });
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (firstLoad) {
            console.log('*** run action ***')

            requestAction({});
        }
    }, deps)
    return {
        fetched,
        loading,
        error,
        data,
        requestAction,
        success,
        count
    }
}