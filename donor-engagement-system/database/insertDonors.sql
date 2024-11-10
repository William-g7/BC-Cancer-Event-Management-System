-- Donors Table
CREATE TABLE Donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    UNIQUE(first_name, last_name)
);

-- Add new columns to existing Donors table
ALTER TABLE Donors
    ADD COLUMN pmm VARCHAR(50),
    ADD COLUMN vmm VARCHAR(50),
    ADD COLUMN smm VARCHAR(50),
    ADD COLUMN nick_name VARCHAR(50),
    ADD COLUMN largest_gift INT,
    ADD COLUMN total_donations INT,
    ADD COLUMN largest_gift_appeal VARCHAR(100),
    ADD COLUMN last_gift_appeal VARCHAR(100),
    ADD COLUMN last_gift_date DATETIME,
    ADD COLUMN last_gift_amount INT,
    ADD COLUMN address_line1 VARCHAR(100),
    ADD COLUMN address_line2 VARCHAR(100),
    ADD COLUMN city VARCHAR(50),
    ADD COLUMN phone_restrictions VARCHAR(100),
    ADD COLUMN communication_restrictions VARCHAR(100),
    ADD COLUMN email_restrictions VARCHAR(100);


