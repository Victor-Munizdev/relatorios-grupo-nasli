import NasliLogo from "@/components/NasliLogo";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-login-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <NasliLogo />
        
        {/* Login Form */}
        <LoginForm />
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            © Copyright 2025. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;