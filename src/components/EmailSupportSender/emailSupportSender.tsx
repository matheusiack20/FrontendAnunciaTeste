import React from "react";

const EmailSupportSender = () => {
  return (
      <div className="w-full">
        <form>
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Assunto:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="mt-2 block w-full px-3 py-2 shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Fale aqui seu problema..."
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 "
            >
              Descrição:
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="mt-2 block w-full px-3 py-2 rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Descreva sobre seu problema..."
              required
            ></textarea>
          </div>
          <div className="flex justify-between">
            <div className="rounded-lg flex justify-center items-center bg-[#F16D6D] w-2/4">
                <span className="text-sm text-white font-extrabold">
                Até 48h para a resposta de solicitações!
                </span>
            </div>
            <button
                type="submit"
                className="w-2/5 bg-primary hover:bg-black text-white font-medium py-2 px-4 rounded-md transition-all"
            >
                Enviar
            </button>

          </div>
        </form>
      </div>
  );
};

export default EmailSupportSender;
