

const ActivePackageProduct = () => {
    return(
        <div className="w-full">
            <div>
                <h1>Pacotes Ativos</h1>
                <h2 className="mt-3 opacity-75">Abaixo são apresentados todos os pacotes ativos</h2>
            </div>
            <div className="mt-5 w-full flex justify-center">
                <div className="w-4/5 flex flex-row justify-between bg-gray-400 p-4 rounded-lg">
                    <div className="flex flex-col items-center justify-between">
                        <h1>PACOTES:</h1>
                        <span className="font-black text-2xl italic">GOLD</span>
                    </div>
                    <div className="flex flex-col items-center justify-between">
                        <h1>VALIDADE:</h1>
                        <span>19/11/2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivePackageProduct;