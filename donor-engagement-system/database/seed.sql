-- 插入 Account 数据
INSERT INTO Accounts (name, password_hash, role) VALUES 
('Alice Smith', 'hashed_password_1', 'Fundraiser'),
('Bob Brown', 'hashed_password_2', 'Fundraiser'),
('Carol White', 'hashed_password_3', 'Fundraiser'),
('David Green', 'hashed_password_4', 'Fundraiser');

-- 插入 Fundraisers 数据（Account 对应 Fundraiser）
INSERT INTO Fundraisers (account_id) VALUES 
(1),
(2),
(3),
(4);

-- 插入 Event 数据
INSERT INTO Events (name, start_time, end_time, location, description, organizer_id, deadline, expected_selection, selected_count) VALUES 
('Gala Night', '2024-11-20 18:00:00', '2024-11-20 22:00:00', '456 High Street', 'An elegant night for raising funds for cancer research', 1, '2024-11-18 23:59:59', 50, 0),
('Charity Run', '2024-12-05 08:00:00', '2024-12-05 12:00:00', '789 Park Ave', 'A community charity run to raise awareness', 2, '2024-12-03 23:59:59', 100, 0),
('Charity Gala', '2024-12-10 18:00:00', '2024-12-10 22:00:00', '123 Main Street', 'An evening gala to raise funds for cancer research', 1, '2024-12-08 23:59:59', 50, 0);

-- 插入 Donors 数据（用于选择和调试）
INSERT INTO Donors (first_name, last_name) VALUES 
('John', 'Doe'), ('Jane', 'Rodrigo'), ('Michael', 'Smith'),
('James', 'Smith'), ('Patricia', 'Johnson'), ('Robert', 'Williams'),
('Jennifer', 'Brown'), ('Michael', 'Jones'), ('Linda', 'Garcia'),
('William', 'Martinez'), ('Elizabeth', 'Rodriguez'), ('David', 'Hernandez'),
('Susan', 'Lopez'), ('Charles', 'Gonzalez'), ('Jessica', 'Wilson'),
('Joseph', 'Anderson'), ('Barbara', 'Thomas'), ('Thomas', 'Taylor'),
 ('Emily', 'Johnson');


-- 插入 Event_Fundraisers 数据（指定四个 Fundraisers 参与该 Event）
INSERT INTO Event_Fundraisers (event_id, fundraiser_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2), (3, 3), (3, 4);


-- Add donors for each fundraiser
-- Event 1 的每个 Fundraiser 选择 3-5 个 Donors
INSERT INTO Selections (event_id, donor_id, event_fundraiser_id, state) VALUES
(1, 15, 1, 'selected'), -- Fundraiser 1 in Event 1
(1, 16, 1, 'selected'),
(1, 17, 1, 'selected'),
(1, 1, 1, 'selected'),
(1, 2, 1, 'selected'),

(1, 3, 2, 'selected'), -- Fundraiser 2 in Event 1
(1, 4, 2, 'selected'),
(1, 5, 2, 'selected'),
(1, 6, 2, 'selected'),

(1, 7, 3, 'selected'), -- Fundraiser 3 in Event 1
(1, 8, 3, 'selected'),
(1, 9, 3, 'selected'),
(1, 10, 3, 'selected'),

(1, 11, 4, 'selected'), -- Fundraiser 4 in Event 1
(1, 12, 4, 'selected'),
(1, 13, 4, 'selected'),
(1, 14, 4, 'selected');

-- Event 2 的每个 Fundraiser 选择 3-5 个 Donors
INSERT INTO Selections (event_id, donor_id, event_fundraiser_id, state) VALUES
(2, 1, 1, 'selected'), -- Fundraiser 1 in Event 2
(2, 2, 1, 'selected'),
(2, 3, 1, 'selected'),
(2, 4, 1, 'selected'),

(2, 5, 2, 'selected'), -- Fundraiser 2 in Event 2
(2, 6, 2, 'selected'),
(2, 7, 2, 'selected'),
(2, 8, 2, 'selected'),
(2, 9, 2, 'selected'),

(2, 10, 3, 'selected'), -- Fundraiser 3 in Event 2
(2, 11, 3, 'selected'),
(2, 12, 3, 'selected'),

(2, 13, 4, 'selected'), -- Fundraiser 4 in Event 2
(2, 14, 4, 'selected'),
(2, 15, 4, 'selected'),
(2, 16, 4, 'selected');

-- Event 3 的每个 Fundraiser 选择 3-5 个 Donors
INSERT INTO Selections (event_id, donor_id, event_fundraiser_id, state) VALUES
(3, 17, 1, 'selected'), -- Fundraiser 1 in Event 3
(3, 18, 1, 'selected'),
(3, 1, 1, 'selected'),
(3, 2, 1, 'selected'),

(3, 3, 2, 'selected'), -- Fundraiser 2 in Event 3
(3, 4, 2, 'selected'),
(3, 5, 2, 'selected'),
(3, 6, 2, 'selected'),

(3, 7, 3, 'selected'), -- Fundraiser 3 in Event 3
(3, 8, 3, 'selected'),
(3, 9, 3, 'selected'),
(3, 10, 3, 'selected'),

(3, 11, 4, 'selected'), -- Fundraiser 4 in Event 3
(3, 12, 4, 'selected'),
(3, 13, 4, 'selected'),
(3, 18, 4, 'selected'),
(3, 19, 4, 'selected');


-- 插入 pmm 数据
INSERT INTO Accounts (name, password_hash, role) VALUES 
('Gurtrude Schmidt', 'hashed_password_1', 'Fundraiser'),
('Hiroshi Nakamura', 'hashed_password_2', 'Fundraiser'),
('Maria González', 'hashed_password_3', 'Fundraiser'),
('Parvati Patel', 'hashed_password_4', 'Fundraiser'),
('Peter Smith', 'hashed_password_5', 'Fundraiser');

-- 插入 Fundraisers 数据（Account 对应 Fundraiser）
INSERT INTO Fundraisers (account_id) VALUES 
(9),
(10),
(11),
(12),
(13);