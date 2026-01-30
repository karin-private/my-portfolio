import { authRepository } from "@/modules/auth/auth.repository";
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils"



function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const currentUserStore = useCurrentUserStore();
  const navigate = useNavigate();
  const [passDisplay, setPassDisplay] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signup = async () => {
    setError(null)

    try {
      const user = await authRepository.signup(name, email, password)
      console.log(user)
      currentUserStore.set(user)

      if (user) {
        navigate("/", { replace: true })
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("登録に失敗しました")
      }
    }
  }

  const onIconClick = () => {
    setPassDisplay(!passDisplay);
  }


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">

      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Notionクローン
        </h2>
        <div className="mt-8 w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className={error ? "rounded-md bg-red-50 p-4 min-h-[56px]" : "p-4 min-h-[56px]"}>
              <div className="flex">
                <div
                  className={cn(
                    "text-sm font-medium text-red-800",
                    !error && "invisible"
                  )}
                >
                  {error || "dummy"}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  ユーザー名
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e) => { setName(e.target.value); setError("") }}
                    id="username"
                    name="username"
                    placeholder="ユーザー名"
                    required
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e) => { setEmail(e.target.value); setError("") }}
                    id="email"
                    name="email"
                    placeholder="メールアドレス"
                    required
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  パスワード
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    onChange={(e) => { setPassword(e.target.value); setError("") }}
                    id="password"
                    name="password"
                    placeholder="パスワード"
                    required
                    type={passDisplay ? "text" : "password"}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  />
                  <div >
                    {passDisplay ? <Eye
                      onClick={onIconClick}
                      className="shrink-0 w-6 h-6 mr-2 text-muted-foreground cursor-pointer"
                    /> : <EyeOff
                      onClick={onIconClick}
                      className="shrink-0 w-6 h-6 mr-2 text-muted-foreground cursor-pointer" />}
                  </div>
                </div>
              </div>
              <div>
                <button
                  disabled={name === "" || email === "" || password === ""}
                  onClick={signup}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  登録
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
