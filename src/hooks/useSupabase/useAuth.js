
import { useState, useEffect } from 'react'
import supabase from '../../supabaseClient';

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [fetched, setFetched] = useState({
        fetched: false,
        hasSession: false
    });
    const login = (input) => supabase.auth.signInWithOtp(input);
    const logout = () => supabase.auth.signOut()
    const isAdmin = user && user.university_role === 'admin'

    const getUserProfile = async () => {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .match({ 'auth_id': session.user.id })
            .single()
        if (error) {
            return console.error(error)
        }
        setUser({ ...profile, ...session.user })
    }

    const getSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setFetched({
                fetched: true,
                hasSession: session ? true : false
            })
        } catch (e) {
            console.error(e.message)
        }
    }
    useEffect(() => {
        getSession()
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (session) {
            getUserProfile()
        } else {
            setUser(null)
        }
    }, [session])
    return { user, login, logout, isAdmin, fetched, session }
}