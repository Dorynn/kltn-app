import React, { useContext, useState } from 'react'
import AuthContext from '../../../context/authContext';
import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Card } from 'antd';
import useModal from '../../../hooks/modal/useModal';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';

export default function Login() {
    const { user, login, logout } = useContext(AuthContext);
    const { openNotification } = useContext(NotificationContext);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        university_role: '',
        user_code: ''
    })

    const createUserModalContent = (<Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        layout="horizontal"
    >
        <Form.Item label="Name">
            <Input onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Email">
            <Input onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Phone">
            <Input onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Role">
            <Input onChange={(e) => setNewUser(prev => ({ ...prev, university_role: e.target.value }))} />
        </Form.Item>
        <Form.Item label="User Code">
            <Input onChange={(e) => setNewUser(prev => ({ ...prev, user_code: e.target.value }))} />
        </Form.Item>
    </Form>)
    const { modal: createUserModal, toggleModal } = useModal({
        content: createUserModalContent,
        title: 'Create new user',
        handleConfirm: handleCreateUser
    })
    const handleLogout = async () => {
        try {
            setLoading(true)
            const { error } = await logout()
            if (!error) {
                return openNotification({ message: 'Log out successfully' })
            }
            openNotification({ type: 'error', message: 'Logout failed', description: error.message })
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    const handleLogin = async () => {
        try {
            setLoading(true)
            const { error } = await login({
                email,
                options: {
                    redirect: 'http://localhost:5173'
                }
            })
            if (!error) {
                return openNotification({ message: 'Reques log in successfully. Please check your mail' })
            }
            openNotification({ type: 'error', message: 'Login failed', description: error.message })
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    async function handleCreateUser() {
        try {
            setLoading(true)
            const { error } = await supabase.functions.invoke('users', {
                method: 'POST',
                body: { user: newUser }
            })
            if (!error) {
                return openNotification({ message: 'Create user successfully' })
            }
            openNotification({ type: 'error', message: 'Create user failed', description: error.message })
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Space style={{ width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }} direction='vertical'>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
                >
                    <Input size='large' style={{ width: '350px' }} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Space direction='horizontal' size='large' style={{ justifyContent: 'flex-end', width: '100%' }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} onClick={() => handleLogin()}>
                            Log in
                        </Button>
                        {user?.university_role === 'admin' &&
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} onClick={() => {
                                toggleModal(true)
                            }}>
                                Create user
                            </Button>
                        }
                    </Space>
                </Form.Item>
            </Form>
            {/* {user && <Card title="User info" style={{ width: 400 }}>
                <p><b>User Code:</b> {user.user_code}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Phone:</b> {user.phone || 'empty'}</p>
                <p><b>Name:</b> {user.name || 'empty'}</p>
                <p><b>Role in University:</b> {user.university_role || 'empty'}</p>
                <p><b>Last Signin at:</b> {new Date(user.last_sign_in_at).toString()}</p>
                <p><b>Created at:</b> {new Date(user.created_at).toString()}</p>
            </Card>} */}
            {createUserModal}
        </Space>
    )
}
