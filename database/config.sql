CREATE SCHEMA a17_heroku;


CREATE TYPE a17_heroku.USER_HELPER AS (
  id   VARCHAR(18),
  name VARCHAR(121)
);


CREATE FUNCTION a17_heroku.get_user_by_email(employee_email VARCHAR(128))
  RETURNS a17_heroku.USER_HELPER AS $$
SELECT
  u.sfid AS id,
  u.name AS name
FROM salesforce."user" AS u
WHERE u.email = employee_email AND u.isactive = TRUE;
$$ LANGUAGE SQL;


CREATE TYPE a17_heroku.VERIFIED_USER AS (
  user_id            VARCHAR(18),
  account_id         VARCHAR(18),
  is_active          BOOLEAN,
  is_already_present BOOLEAN
);


CREATE FUNCTION a17_heroku.get_verified_user(employee_email VARCHAR(128), verification_code VARCHAR(8))
  RETURNS a17_heroku.VERIFIED_USER AS $$
SELECT
  u.sfid         AS user_id,
  a.sfid         AS account_id,
  a.is_active__c AS is_active,
  (
    SELECT count(pe.id) != 0
    FROM salesforce.presence_entry__c AS pe
    WHERE pe.start_date__c :: DATE = now() :: DATE
  )              AS is_already_present
FROM salesforce.user_to_account_mapping__c AS utam
  RIGHT JOIN salesforce."user" AS u ON u.sfid = utam.user__c
  LEFT JOIN salesforce.account AS a ON a.sfid = utam.account__c
WHERE u.email = employee_email AND u.verification_code__c = verification_code AND u.isactive = TRUE;
$$ LANGUAGE SQL;


CREATE FUNCTION a17_heroku.log_office_entrance(employee_id VARCHAR(18), office_id VARCHAR(18))
  RETURNS VOID AS $$
INSERT INTO salesforce.presence_entry__c (office__c, employee__c, start_date__c)
VALUES (office_id, employee_id, now());
$$ LANGUAGE SQL;


CREATE FUNCTION a17_heroku.log_office_leave(employee_id VARCHAR(18), office_id VARCHAR(18))
  RETURNS VOID AS $$
UPDATE salesforce.presence_entry__c
SET end_date__c = now()
WHERE employee__c = employee_id AND office__c = office_id AND start_date__c :: DATE = now() :: DATE;
$$ LANGUAGE SQL;


CREATE FUNCTION a17_heroku.log_office(employee_id VARCHAR(18), office_id VARCHAR(18), is_already_present BOOLEAN)
  RETURNS VOID AS $$
BEGIN
  IF is_already_present = TRUE
  THEN
    SELECT a17_heroku.log_office_leave(employee_id, office_id);
  ELSE
    SELECT a17_heroku.log_office_entrance(employee_id, office_id);
  END IF;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION a17_heroku.validate_presence_entry()
  RETURNS TRIGGER AS $$
DECLARE
  is_already_present BOOLEAN;
BEGIN
  IF new.end_date__c IS NOT NULL
  THEN
    RAISE 'End date has to be empty on creation';
  ELSE
    SELECT (count(*) != 0)
    INTO is_already_present
    FROM salesforce.presence_entry__c AS pe
    WHERE
      pe.employee__c = new.employee__c AND pe.office__c = new.office__c AND pe.start_date__c :: DATE = now() :: DATE;

    IF is_already_present IS TRUE
    THEN
      RAISE 'Only one salesforce.presence_entry__c can be created per day';
    ELSE
      RETURN new;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER salesforce_presence_entry__validate_presence_entry
BEFORE INSERT ON salesforce.presence_entry__c
FOR EACH ROW
EXECUTE PROCEDURE a17_heroku.validate_presence_entry();