-- Garante que a extensão de criptografia esteja habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Atualiza a senha do usuário administrador
UPDATE auth.users
SET encrypted_password = crypt('ncc1701@EGRESSO', gen_salt('bf')),
    updated_at = now()
WHERE email = 'nilton.junior@uemg.br';

-- Se precisar confirmar se o usuário existe antes (opcional, apenas para verificação)
-- SELECT id, email FROM auth.users WHERE email = 'nilton.junior@uemg.br';
