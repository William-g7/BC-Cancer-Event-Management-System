-- 使用当前数据库
USE donor_engagement_system;

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
('Charity Gala', '2024-12-10 18:00:00', '2024-12-10 22:00:00', '123 Main Street', 'An evening gala to raise funds for cancer research', 1, '2024-12-08 23:59:59', 50, 0);

-- 插入 Donors 数据（用于选择和调试）
INSERT INTO Donors (first_name, last_name) VALUES 
('John', 'Doe'),
('Jane', 'Doe'),
('Michael', 'Smith'),
('Emily', 'Johnson');

-- 插入 Event_Fundraisers 数据（指定四个 Fundraisers 参与该 Event）
INSERT INTO Event_Fundraisers (event_id, fundraiser_id) VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4);
