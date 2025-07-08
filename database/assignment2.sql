-- Assignment writing practice

-- No. 1
INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- No. 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- No. 3
DELETE FROM account WHERE account_id = 1;

-- No.4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- No.5
SELECT inv_make, inv_model, classification_name FROM inventory
INNER JOIN classification
ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

-- No.6
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');