CREATE SEQUENCE vanilla_demo_bookmarks_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MAXVALUE
        NO MINVALUE
        CACHE 1;

CREATE TABLE vanilla_demo_bookmarks (
        id bigint DEFAULT nextval('vanilla_demo_bookmarks_id_seq'::regclass) NOT NULL,
        rad_exam_id bigint NOT NULL,
        identifier text NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone NOT NULL
);

ALTER TABLE vanilla_demo_bookmarks
        ADD CONSTRAINT vanilla_demo_bookmarks_id PRIMARY KEY (id);
