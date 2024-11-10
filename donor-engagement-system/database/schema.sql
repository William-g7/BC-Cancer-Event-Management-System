-- Use donor_engagement_system database
USE donor_engagement_system;

-- Accounts Table
CREATE TABLE Accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role ENUM('Fundraiser', 'Coordinator'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, role)
);

-- Fundraisers Table
CREATE TABLE Fundraisers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT UNIQUE,
    FOREIGN KEY (account_id) REFERENCES Accounts(id)
);

-- Coordinators Table
CREATE TABLE Coordinators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT UNIQUE, 
    FOREIGN KEY (account_id) REFERENCES Accounts(id)
);

-- Donors Table
CREATE TABLE Donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    UNIQUE(first_name, last_name)
);

-- Events Table 
CREATE TABLE Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    location VARCHAR(255),
    description TEXT,
    organizer_id INT,
    deadline DATETIME,
    expected_selection INT,  
    selected_count INT,  
    UNIQUE(name), 
    FOREIGN KEY (organizer_id) REFERENCES Fundraisers(id)
);

-- Donor Notes Table
CREATE TABLE Donor_Notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    fundraiser_id INT,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(donor_id, fundraiser_id), 
    FOREIGN KEY (donor_id) REFERENCES Donors(id),
    FOREIGN KEY (fundraiser_id) REFERENCES Fundraisers(id)
);

-- Event Fundraisers Table
CREATE TABLE Event_Fundraisers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    fundraiser_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(id),
    FOREIGN KEY (fundraiser_id) REFERENCES Fundraisers(id)
);

-- Selections Table
CREATE TABLE Selections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT, 
    donor_id INT, 
    event_fundraiser_id INT, 
    note TEXT, 
    state ENUM('unselect', 'selected', 'confirmed'),  
    FOREIGN KEY (event_id) REFERENCES Events(id),
    FOREIGN KEY (donor_id) REFERENCES Donors(id),
    FOREIGN KEY (event_fundraiser_id) REFERENCES Event_Fundraisers(id),
    UNIQUE(event_id, donor_id, event_fundraiser_id) 
);

-- Drop the name index from Events table
ALTER TABLE Events DROP INDEX name;

DELIMITER //

CREATE TRIGGER update_selected_count
AFTER INSERT ON Selections
FOR EACH ROW
BEGIN
    UPDATE Events
    SET selected_count = (
        SELECT COUNT(*)
        FROM Selections
        WHERE event_id = NEW.event_id
    )
    WHERE id = NEW.event_id;
END //

DELIMITER ;





