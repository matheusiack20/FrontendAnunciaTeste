import ConfigLayoutPage from "@/components/configLayoutPage/page";
import EmailSupportSender from "@/components/EmailSupportSender/emailSupportSender";

const ContentPageSupport = () => {
    return(
        <div className="h-full w-full flex justify-center">
            <div className="w-3/5">
                <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                    <h1 className="text-[20px] font-sans font-medium">Fale Conosco</h1>
                    <h2 className="mt-3 text-[16px]">Fale com um especialista</h2>
                </div>
                <div>
                    <EmailSupportSender/>
                </div>
            </div>
        </div>
    );
}

const support = () => {
    return(
        <>
            <ConfigLayoutPage content={<ContentPageSupport/>} />
        </>
    );
}

export default support;