import { MailIcon } from "lucide-react";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

export const ChangeEmailProfile = () => {
    return (
        <div>
            <h1>Administre a conta de email utilizada pela plataforma</h1>
            <div className="flex justify-between w-full mt-3 items-end">
                <div className="w-96">
                    <h1>Email</h1>
                    <div className="mt-2 p-2 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <MailIcon className="mr-2 opacity-50"/>
                        <span className="opacity-50">email@email.com</span>
                    </div>
                </div>
                <button className="p-2 rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50 transition-all hover:bg-gray-200">
                    <ChangeCircleIcon className="mr-2 text-primary"/>alterar email
                </button>
            </div>
        </div>
    );
}

export const ChangePasswordProfile = () => {
    return(
        <div className="flex justify-between">
            <div>
                <h1>Senha</h1>
                <h2 className="mt-3 opacity-75">Defina nova senha</h2>
            </div>
            <button className="w-56 bg-red-400 p-1 rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50 transition-all hover:bg-red-500">Alterar Senha</button>
        </div>
    );
}

