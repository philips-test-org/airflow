create user vanilla password '2893ourj8923urjl';
create schema AUTHORIZATION vanilla;
revoke all on all tables in schema public from vanilla;
grant usage on schema public to vanilla;
grant select on all tables in schema public to vanilla;
alter user vanilla set search_path to vanilla,public;
