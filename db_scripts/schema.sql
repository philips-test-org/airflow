CREATE SCHEMA airflow;

SET search_path = airflow, pg_catalog;

CREATE SEQUENCE airflow_exam_events_id_seq
	START WITH 1
	INCREMENT BY 1
	NO MAXVALUE
	NO MINVALUE
	CACHE 1;

CREATE SEQUENCE airflow_exam_adjustments_id_seq
	START WITH 1
	INCREMENT BY 1
	NO MAXVALUE
	NO MINVALUE
	CACHE 1;

CREATE SEQUENCE airflow_resource_groups_id_seq
	START WITH 1
	INCREMENT BY 1
	NO MAXVALUE
	NO MINVALUE
	CACHE 1;

CREATE SEQUENCE airflow_resource_group_mappings_id_seq
	START WITH 1
	INCREMENT BY 1
	NO MAXVALUE
	NO MINVALUE
	CACHE 1;

CREATE TABLE airflow_exam_adjustments (
       	id bigint DEFAULT nextval('airflow_exam_adjustments_id_seq'::regclass) NOT NULL,
	rad_exam_id bigint NOT NULL,
	exam_start_time timestamp with time zone,
	resource_id bigint,
	anesthesia boolean DEFAULT false NOT NULL,
	paperwork boolean DEFAULT false NOT NULL,
	consent boolean DEFAULT false NOT NULL,
	onhold boolean DEFAULT false NOT NULL,
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE TYPE airflow_exam_event_type AS ENUM ('comment', 'anesthesia', 'paperwork', 'consent', 'hold');

CREATE TABLE airflow_exam_events (
       	id bigint DEFAULT nextval('airflow_exam_events_id_seq'::regclass) NOT NULL,
	event_type airflow_exam_event_type NOT NULL,
	comments text,
	employee_id bigint NOT NULL,
	rad_exam_id bigint NOT NULL,
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE airflow_resource_groups (
       	id bigint DEFAULT nextval('airflow_resource_groups_id_seq'::regclass) NOT NULL,
	group_name text NOT NULL,
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE airflow_resource_group_mappings (
       	id bigint DEFAULT nextval('airflow_resource_group_mappings_id_seq'::regclass) NOT NULL,
	resource_group_id bigint NOT NULL,
	resource_id bigint NOT NULL,
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE airflow_exam_adjustments
	ADD CONSTRAINT airflow_exam_adjustments_id PRIMARY KEY (id);

ALTER TABLE airflow_issues
	ADD CONSTRAINT airflow_issues_id PRIMARY KEY (id);

CREATE INDEX airflow_exam_adjustments_rad_exam_id_idx ON airflow_exam_adjustments USING btree (rad_exam_id);

CREATE INDEX airflow_exam_events_rad_exam_id_idx ON airflow_exam_events USING btree (rad_exam_id);

CREATE INDEX airflow_exam_events_employee_id_idx ON airflow_exam_events USING btree (employee_id);
