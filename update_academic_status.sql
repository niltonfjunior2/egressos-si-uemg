-- Script de Correção Retroativa: Atualização do 'status' na tabela academic_records
-- Baseado no ano atual (2026).
-- Alunos com ano de formatura menor ou igual a 2026 recebem 'formado'.
-- Alunos com formatura prevista para 2027 em diante recebem 'cursando'.

BEGIN;

-- 1. Atualiza alunos que já se formaram (ano de graduação <= 2026)
UPDATE academic_records
SET status = 'formado'
WHERE graduation_year <= EXTRACT(YEAR FROM CURRENT_DATE);

-- 2. Atualiza alunos que ainda vão se formar (ano de graduação > 2026)
UPDATE academic_records
SET status = 'cursando'
WHERE graduation_year > EXTRACT(YEAR FROM CURRENT_DATE);

-- 3. Caso tenha registros sem 'graduation_year', você pode mantê-los como 'cursando'
UPDATE academic_records
SET status = 'cursando'
WHERE graduation_year IS NULL;

COMMIT;
