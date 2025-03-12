'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GenerateDataContextValue {
  selectedTitleValue: string | undefined;
  setSelectedTitleValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedDescriptionValue: string | undefined;
  setSelectedDescriptionValue: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

const GenerateDataContext = createContext<GenerateDataContextValue | undefined>(
  undefined,
);

const GenerateDataProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTitleValue, setSelectedTitleValue] = useState<
    string | undefined
  >(undefined);
  const [selectedDescriptionValue, setSelectedDescriptionValue] = useState<
    string | undefined
  >(undefined);

  return (
    <GenerateDataContext.Provider
      value={{
        selectedTitleValue,
        setSelectedTitleValue,
        selectedDescriptionValue,
        setSelectedDescriptionValue,
      }}
    >
      {children}
    </GenerateDataContext.Provider>
  );
};

const useGenerateData = () => {
  const context = useContext(GenerateDataContext);
  if (!context) {
    throw new Error(
      'useGenerateData must be used within a GenerateDataProvider',
    );
  }
  return context;
};

export { GenerateDataProvider, useGenerateData };
