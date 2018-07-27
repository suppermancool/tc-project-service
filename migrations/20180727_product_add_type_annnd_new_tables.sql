
-- UPDATE EXISTING TABLES:
--   product_templates
--     type column: added
--
-- CREATE NEW TABLES:
--   product_categories
--



--
-- product_templates
--
ALTER TABLE product_templates ADD COLUMN "category" character varying(255);
UPDATE product_templates set category='' where category is null;
ALTER TABLE product_templates ALTER COLUMN "category" SET NOT NULL;


--
-- product_categories
--


CREATE TABLE product_categories
(
    key character varying(45) COLLATE pg_catalog."default" NOT NULL,
    "displayName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    icon character varying(255) COLLATE pg_catalog."default" NOT NULL,
    question character varying(255) COLLATE pg_catalog."default" NOT NULL,
    info character varying(255) COLLATE pg_catalog."default" NOT NULL,
    aliases json NOT NULL,
    disabled boolean DEFAULT false,
    hidden boolean DEFAULT false,
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "deletedBy" integer,
    "createdBy" integer NOT NULL,
    "updatedBy" integer NOT NULL,
    CONSTRAINT product_categories_pkey PRIMARY KEY (key)
);
