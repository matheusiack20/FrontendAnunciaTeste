import ConfigLayoutPage from "@/components/configLayoutPage/page";

const ContentPageBills = () => {
    return(
        <div className="h-full w-full flex justify-center">
            <div className="w-3/5">
                <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                    <h1 className="text-[20px] font-sans font-medium">Minhas Faturas</h1>
                    <h2 className="mt-3 text-[16px]">Informações de faturas ativas.</h2>
                </div>
            </div>
        </div>
    );
}

const userConfig = () => {
    return(
        <>
            <ConfigLayoutPage content={<ContentPageBills/>} />
        </>
    );  
}

export default userConfig;