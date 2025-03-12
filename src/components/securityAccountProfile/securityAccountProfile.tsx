import { LogOutIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";

const SecurityAccountProfile = () => {

    return (
        <div>
            <h1>Segurança da Conta</h1>
            <h2 className="mt-3 opacity-75">Administre a segurança da conta</h2>
            <div className="flex justify-between mt-3 text-xs">
                <button className="items-center font-bold whitespace-nowrap flex p-2 rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                    <LogOutIcon className="mr-3 w-4"/>Logout
                </button>
                <button className="items-center font-bold whitespace-nowrap flex text-red-400 p-2 rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                    <TrashIcon className="mr-3 w-4"/> Apagar Conta
                </button>
            </div>
        </div>

    );
}

export default SecurityAccountProfile;