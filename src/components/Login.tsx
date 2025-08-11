import { useState } from "react";
import { loginUser } from "../services/authService";

interface LoginProps {
  setAccessToken: (token: string) => void;
  setMensaje: (mensaje: string) => void;
}

const Login: React.FC<LoginProps> = ({ setAccessToken, setMensaje }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const token = await loginUser(username, password);
      setAccessToken(token);
    } catch (error: any) {
      setMensaje(`Error de inicio de sesión: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#12002f]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <img src="public/img/image.png" alt="Factus Logo" className="h-20" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Factus
        </h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Correo"
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <div className="flex items-center justify-between text-sm mb-4 text-gray-600"></div>
        <button
          className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
          onClick={handleLogin}
        >
          INICIAR SESIÓN
        </button>
      </div>
    </div>
  );
};

export default Login;
