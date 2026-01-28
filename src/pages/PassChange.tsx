import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { authRepository } from '@/modules/auth/auth.repository';


export default function ChangePasswordForm() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const validate = () => {
        if (password.length < 8) {
            return 'パスワードは8文字以上にしてください'
        }
        if (password !== confirm) {
            return 'パスワードが一致しません'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password,
        })

        setLoading(false)

        if (error) {
            setError(error.message)
        } else {
            await authRepository.signout();

            setSuccess(true)
            setPassword('')
            setConfirm('')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
            <h2>パスワード変更</h2>

            <div>
                <label>新しいパスワード</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8文字以上"
                />
            </div>

            <div>
                <label>確認用パスワード</label>
                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>パスワードを変更しました</p>}

            <button type="submit" disabled={loading}>
                {loading ? '変更中…' : '変更する'}
            </button>
        </form>
    )
}
