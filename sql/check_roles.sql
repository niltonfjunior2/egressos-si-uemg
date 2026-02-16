-- Lista os valores válidos para o tipo enum 'user_role'
SELECT e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'user_role';
