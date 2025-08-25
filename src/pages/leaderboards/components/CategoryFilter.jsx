import React from 'react';
import Select from '../../../components/ui/Select';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categoryOptions = [
    { value: 'overall', label: 'Classificação Geral' },
    { value: 'highest-win', label: 'Maior Vitória Individual' },
    { value: 'most-games', label: 'Mais Jogos Disputados' },
    { value: 'best-accuracy', label: 'Melhor Precisão' },
    { value: 'biggest-profit', label: 'Maior Margem de Lucro' }
  ];

  return (
    <div className="mb-6">
      <Select
        label="Categoria do Ranking"
        options={categoryOptions}
        value={selectedCategory}
        onChange={onCategoryChange}
        className="max-w-xs"
      />
    </div>
  );
};

export default CategoryFilter;