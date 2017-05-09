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

CREATE SEQUENCE airflow_site_config_id_seq
	START WITH 1
	INCREMENT BY 1
	NO MAXVALUE
	NO MINVALUE
	CACHE 1;


CREATE TABLE airflow_exam_adjustments (
       	id bigint DEFAULT nextval('airflow_exam_adjustments_id_seq'::regclass) NOT NULL,
	rad_exam_id bigint NOT NULL,
	adjusted_attributes text NOT NULL DEFAULT '{}',
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE TABLE airflow_exam_events (
       	id bigint DEFAULT nextval('airflow_exam_events_id_seq'::regclass) NOT NULL,
	exam_adjustment_id bigint NOT NULL,
	employee_id bigint NOT NULL,
	event_type text NOT NULL,
	new_state text,
	comments text,
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

CREATE TABLE airflow_site_config (
       id bigint DEFAULT nextval('airflow_site_config_id_seq'::regclass) NOT NULL,
       username text,
       configuration_time timestamp,
       configuration_json text,
       created_at timestamp with time zone DEFAULT now() NOT NULL,
       updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE airflow_exam_adjustments
	ADD CONSTRAINT airflow_exam_adjustments_id PRIMARY KEY (id);

ALTER TABLE airflow_exam_events
	ADD CONSTRAINT airflow_exam_events_id PRIMARY KEY (id);

ALTER TABLE airflow_resource_groups
	ADD CONSTRAINT airflow_resource_groups_id PRIMARY KEY (id);

ALTER TABLE airflow_resource_group_mappings
	ADD CONSTRAINT airflow_resource_group_mappings_id PRIMARY KEY (id);

ALTER TABLE airflow_exam_events
	ADD CONSTRAINT airflow_exam_events_exam_adjustments_fk FOREIGN KEY (exam_adjustment_id) REFERENCES airflow_exam_adjustments(id);

ALTER TABLE airflow_resource_group_mappings
	ADD CONSTRAINT airflow_resource_group_mappings_resource_groups_fk FOREIGN KEY (resource_group_id) REFERENCES airflow_resource_groups(id);

ALTER TABLE airflow_site_config
      ADD CONSTRAINT airflow_site_config_id_pk PRIMARY KEY (id);

CREATE INDEX airflow_exam_adjustments_rad_exam_id_idx ON airflow_exam_adjustments USING btree (rad_exam_id);

CREATE INDEX airflow_exam_events_exam_adjustment_id_idx ON airflow_exam_events USING btree (exam_adjustment_id);

CREATE INDEX airflow_exam_events_employee_id_idx ON airflow_exam_events USING btree (employee_id);
