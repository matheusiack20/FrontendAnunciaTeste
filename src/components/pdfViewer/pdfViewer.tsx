"use client";

const PdfViewer = () => {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/manual.pdf"; // Caminho para o arquivo PDF
        link.download = "Manual_AnuncIA.pdf"; // Nome do arquivo ao baixar
        link.click();
    };
    return(
    <div className="w-full h-[600px] flex flex-col">
      <iframe src="/manual.pdf" className="w-full h-full" />
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-hover_button transition"
      >
        Baixar Manual
      </button>
    </div>
    )
};
  
  export default PdfViewer;
  