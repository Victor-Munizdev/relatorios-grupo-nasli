import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, User, Lock } from "lucide-react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", loginData);
  };

  return (
    <div className="bg-login-card rounded-xl p-8 shadow-2xl max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LOGIN:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
              className="pl-10 bg-login-input-bg border-gray-300 h-12"
              placeholder=""
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SENHA:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-10 pr-12 bg-login-input-bg border-gray-300 h-12"
              placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center bg-login-green rounded-r-md px-3 hover:bg-login-green/90 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-white" />
              ) : (
                <Eye className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full bg-login-green hover:bg-login-green/90 text-white font-semibold h-12 text-lg rounded-md transition-colors"
        >
          LOGAR
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            className="text-login-text-muted hover:text-gray-800 text-sm transition-colors"
          >
            Esqueceu sua senha? <span className="underline">Renove-a!</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;