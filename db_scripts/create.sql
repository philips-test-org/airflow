create user airflow password '2893ourj8923urjl';
create schema AUTHORIZATION airflow;
revoke all on all tables in schema public from airflow;
grant usage on schema public to airflow;
grant select on all tables in schema public to airflow;
alter user airflow set search_path to airflow,public;
