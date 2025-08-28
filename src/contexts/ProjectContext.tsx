import { createContext, ReactNode, useContext, useState } from "react";

interface ProjectContextType {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  clearSelectedCategory: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const clearSelectedCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        clearSelectedCategory,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
