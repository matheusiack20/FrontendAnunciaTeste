import ConfigLayoutPage from "@/components/configLayoutPage/page";
import Image from "next/image";
import Logo_MAP from '/public/LOGO1.png'
import Link from "next/link";
import QuestionCollapse from "@/components/questionTips/questionTips";
import GraphDate from "@/components/graphDate/graphDate";


const ContentPagePackageConsume = () => {
    return(
        <div className="h-full w-full flex justify-center">
            <div className="w-3/5">
                <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                    <h1 className="text-[20px] font-sans font-medium">Consumo do pacote</h1>
                    <h2 className="mt-3 text-[16px]">Confira seu consumo de pacote do serviço</h2>
                </div>
                <div>
                    <GraphDate/>
                </div>
                <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                    <h1 className="text-[20px] font-sans font-medium">Dicas de Uso Otimizado</h1>
                    <h2 className="mt-3 text-[16px]">Confira algumas das dicas de uso do serviço</h2>
                </div>
                <QuestionCollapse/>
                <div className="mt-[25px]">
                    <div className="border-b-[1px] border-black  mb-[25px] pb-[25px] border-opacity-30">
                        <h1 className="text-[20px] font-sans font-medium">Quer uma ajuda mais especializada ?</h1>
                    </div>
                    <h2 className="text-[16px]"><strong className="opacity-75">
                    Esta tendo problemas com seus anúncios e quer aumentar mais sua relevância ?
                    </strong><br/>
                    Que tal entrar em contato conosco e obter uma assesoria exclusiva e acabar com todas suas dúvidas!</h2>
                    <div className="flex justify-center">
                        <Link className="w-2/3" href="https://mapmarketplaces.com/" passHref>
                            <button className="mt-[25px] w-full h-[100px] bg-[#282828] rounded-2xl flex justify-center items-center hover:bg-[#3d3d3d] transition-all">
                                <Image
                                    width={150}
                                    height={150}
                                    alt={'Logo_Map'}
                                    src={Logo_MAP}
                                />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const packageConsume = () => {
    return(
        <>
            <ConfigLayoutPage content={<ContentPagePackageConsume/>} />
        </>
    );
}

export default packageConsume;