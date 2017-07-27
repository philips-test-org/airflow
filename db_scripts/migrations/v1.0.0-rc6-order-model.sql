TRUNCATE airflow_exam_events;

DROP TABLE airflow_exam_adjustments CASCADE;

CREATE TABLE airflow_exam_adjustments (
       	id bigint DEFAULT nextval('airflow_exam_adjustments_id_seq'::regclass) NOT NULL,
	order_id bigint NOT NULL,
	adjusted_attributes text NOT NULL DEFAULT '{}',
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE airflow_exam_adjustments
	ADD CONSTRAINT airflow_exam_adjustments_id PRIMARY KEY (id);

ALTER TABLE airflow_exam_events
	ADD CONSTRAINT airflow_exam_events_exam_adjustments_fk FOREIGN KEY (exam_adjustment_id) REFERENCES airflow_exam_adjustments(id);

CREATE INDEX airflow_exam_adjustments_order_id_idx ON airflow_exam_adjustments USING btree (order_id);
