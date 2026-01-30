import { AuthError } from "@supabase/supabase-js"

export type AuthType = "signup" | "login"

export const convertSupabaseAuthError = (
    type: AuthType,
    error: AuthError | null
): string => {
    if (!error) return "不明なエラーが発生しました"

    if (type === "login") {
        if (
            error.message.includes("Invalid login credentials") ||
            error.message.includes("Invalid email or password")
        ) {
            return "メールアドレスまたはパスワードが正しくありません"
        }

        if (error.message.includes("Email not confirmed")) {
            return "メールアドレスの確認が完了していません"
        }
    }

    if (type === "signup") {
        if (error.message.includes("User already registered")) {
            return "このメールアドレスは既に登録されています"
        }

        if (error.message.includes("Password should be at least")) {
            return "パスワードは6文字以上で入力してください"
        }
    }

    return "認証に失敗しました"
}
