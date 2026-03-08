-- Arquivo de Limpeza do Banco de Dados
-- Exclusão do Módulo de Notícias / Feed 

BEGIN;

DROP TABLE IF EXISTS feed_posts CASCADE;

COMMIT;
