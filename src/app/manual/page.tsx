import ConfigLayoutPage from "@/components/configLayoutPage/page";
import PdfViewer from "@/components/pdfViewer/pdfViewer";

const ContentPageManual = () => {
    return(
        <div id="manual" className="h-full w-full flex justify-center">
            <div className="w-3/5">
                <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                    <h1 className="text-[20px] font-sans font-medium">Manual do Usuário</h1>
                    <h2 className="mt-3 text-[16px]">O manual de usuário expõe todas informações úteis do seu serviço AnuncIA.</h2>
                </div>
                {/* Esse componente faz uso de cookie logo é necessário um aviso de consentimento */}
                <PdfViewer/>
            </div>
        </div>
    );
}

const manual = () => {
    return(
        <>
            <ConfigLayoutPage content={<ContentPageManual/>} />
        </>
    );  
}

export default manual;