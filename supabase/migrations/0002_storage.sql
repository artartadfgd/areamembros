-- Bucket público para as fotos de capa dos produtos, enviadas pelo
-- painel /admin. "public" aqui significa só leitura pública (qualquer
-- um pode ver a imagem pela URL) — o upload continua exigindo a
-- service role key, usada apenas no servidor.
insert into storage.buckets (id, name, public)
values ('product-covers', 'product-covers', true)
on conflict (id) do nothing;
