create user starterapp password '2893ourj8923urjl';
create schema AUTHORIZATION starterapp;
revoke all on all tables in schema public from starterapp;
grant usage on schema public to starterapp;
grant select on all tables in schema public to starterapp;
alter user starterapp set search_path to starterapp,public;
