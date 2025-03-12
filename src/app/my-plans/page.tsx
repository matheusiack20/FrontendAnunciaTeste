import ConfigLayoutPage from "@/components/configLayoutPage/page";
import PlansPriceBoard from "@/components/plansBoard/plansBoard";

const ContentPageMyPlans = () => {
    return(
        <div className="h-full w-full flex flex-col items-center">
            <div className="w-3/5">
                <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                    <h1 className="text-[20px] font-sans font-medium">Minhas ofertas de planos</h1>
                    <h2 className="text-[16px]">Aqui estão todas as suas ofertas de planos disponíveis</h2>
                    <h2 className="mt-3 text-[16px]">Confira o melhor plano ao seu gosto</h2>
                </div>
            </div>
            <div>
                <PlansPriceBoard/>
            </div>
        </div>
    );
}

const myPlans = () => {
    return(
        <>
            <ConfigLayoutPage content={<ContentPageMyPlans/>} />
        </>
    );
}

export default myPlans;