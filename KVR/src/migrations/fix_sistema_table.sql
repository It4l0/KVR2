-- Primeiro, adicione a coluna permitindo nulos
ALTER TABLE sistema ADD COLUMN IF NOT EXISTS nome VARCHAR;

-- Atualize os registros existentes com um valor padrão
UPDATE sistema SET nome = descricao WHERE nome IS NULL;

-- Finalmente, altere a coluna para NOT NULL
ALTER TABLE sistema ALTER COLUMN nome SET NOT NULL;
