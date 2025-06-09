export const tableSchemas = {
    role: `
        CREATE TABLE IF NOT EXISTS role (
            id serial NOT NULL,
            name character varying(50) NOT NULL,
            CONSTRAINT role_pkey PRIMARY KEY (id),
            CONSTRAINT role_name_key UNIQUE (name)
            )
    `,
    users: `
        CREATE TABLE IF NOT EXISTS "User" (
            id serial NOT NULL,
            name character varying(100) NOT NULL,
            email character varying(100) NOT NULL,
            password text NOT NULL,
            role_id integer NOT NULL,
            created_at timestamp without time zone DEFAULT now(),
            token character varying(255),
            forgot_password_code character varying(6),
            CONSTRAINT "User_pkey" PRIMARY KEY (id),
            CONSTRAINT "User_role_id_fkey" FOREIGN KEY (role_id)
                REFERENCES role (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT "User_email_key" UNIQUE (email)
            )
    `,
    herbarium_types: `
        CREATE TABLE IF NOT EXISTS herbarium_type (
            id serial NOT NULL,
            name character varying(100) NOT NULL,
            description text,
            status boolean DEFAULT true,
            is_deleted boolean DEFAULT false,
            CONSTRAINT herbarium_type_pkey PRIMARY KEY (id)
            )
    `,
    families: `
        CREATE TABLE IF NOT EXISTS family (
            id serial NOT NULL,
            herbarium_type_id integer NOT NULL,
            name character varying(100) NOT NULL,
            description text,
            status boolean DEFAULT true,
            is_deleted boolean DEFAULT false,
            CONSTRAINT family_pkey PRIMARY KEY (id),
            CONSTRAINT family_herbarium_type_id_fkey FOREIGN KEY (herbarium_type_id)
                REFERENCES herbarium_type (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION
            )
    `,
    plants: `
        CREATE TABLE IF NOT EXISTS plant (
            id serial NOT NULL,
            family_id integer NOT NULL,
            common_name character varying(100),
            scientific_name character varying(100) NOT NULL,
            quantity integer DEFAULT 0,
            description text,
            status boolean DEFAULT true,
            is_deleted boolean DEFAULT false,
            refs character varying(1000),
            CONSTRAINT plant_pkey PRIMARY KEY (id),
            CONSTRAINT plant_family_id_fkey FOREIGN KEY (family_id)
                REFERENCES family (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION
            )
    `,
    plant_images: `
        CREATE TABLE IF NOT EXISTS plant_img (
            id serial NOT NULL,
            plant_id integer NOT NULL,
            image_url text NOT NULL,
            description text,
            created_at timestamp without time zone DEFAULT now(),
            is_deleted boolean DEFAULT false,
            status boolean DEFAULT true,
            CONSTRAINT plant_img_pkey PRIMARY KEY (id),
            CONSTRAINT plant_img_plant_id_fkey FOREIGN KEY (plant_id)
                REFERENCES plant (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION
            )
    `,
    logs: `
        CREATE TABLE IF NOT EXISTS log_event (
            id serial NOT NULL,
            user_id integer NOT NULL,
            herbarium_type_id integer,
            family_id integer,
            plant_id integer,
            plant_img_id integer,
            description text,
            created_at timestamp without time zone DEFAULT now(),
            CONSTRAINT log_event_pkey PRIMARY KEY (id),
            CONSTRAINT log_event_family_id_fkey FOREIGN KEY (family_id)
                REFERENCES family (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT log_event_herbarium_type_id_fkey FOREIGN KEY (herbarium_type_id)
                REFERENCES herbarium_type (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT log_event_plant_id_fkey FOREIGN KEY (plant_id)
                REFERENCES plant (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT log_event_plant_img_id_fkey FOREIGN KEY (plant_img_id)
                REFERENCES plant_img (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT log_event_user_id_fkey FOREIGN KEY (user_id)
                REFERENCES "User" (id) MATCH SIMPLE
                ON UPDATE NO ACTION ON DELETE NO ACTION
            )
    `
};

export const triggerSchemas = {
    updateFamilyStatus: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trg_update_family_status') THEN
                CREATE FUNCTION trg_update_family_status()
                RETURNS TRIGGER AS $BODY$
                BEGIN
                    -- Solo actualizar si cambia el status
                    IF NEW.status IS DISTINCT FROM OLD.status THEN
                        UPDATE family
                        SET status = NEW.status
                        WHERE herbarium_type_id = NEW.id;
                    END IF;

                    -- Solo actualizar si cambia el is_deleted
                    IF NEW.is_deleted IS DISTINCT FROM OLD.is_deleted THEN
                        UPDATE family
                        SET is_deleted = NEW.is_deleted
                        WHERE herbarium_type_id = NEW.id;
                    END IF;

                    RETURN NEW;
                END;
                $BODY$ LANGUAGE plpgsql;

                -- Crear el trigger si no existe
                CREATE TRIGGER after_update_herbarium_type
                AFTER UPDATE OF status, is_deleted ON herbarium_type
                FOR EACH ROW
                EXECUTE PROCEDURE trg_update_family_status();
            END IF;
        END $$;
    `,
    updatePlantStatus: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trg_update_plant_status') THEN
                CREATE FUNCTION trg_update_plant_status()
                RETURNS TRIGGER AS $BODY$
                BEGIN
                    -- Solo actualizar si cambia el status
                    IF NEW.status IS DISTINCT FROM OLD.status THEN
                        UPDATE plant
                        SET status = NEW.status
                        WHERE family_id = NEW.id;
                    END IF;

                    -- Solo actualizar si cambia el is_deleted
                    IF NEW.is_deleted IS DISTINCT FROM OLD.is_deleted THEN
                        UPDATE plant
                        SET is_deleted = NEW.is_deleted
                        WHERE family_id = NEW.id;
                    END IF;

                    RETURN NEW;
                END;
                $BODY$ LANGUAGE plpgsql;

                -- Crear el trigger si no existe
                CREATE TRIGGER after_update_family
                AFTER UPDATE OF status, is_deleted ON family
                FOR EACH ROW
                EXECUTE PROCEDURE trg_update_plant_status();
            END IF;
        END $$;
    `
};