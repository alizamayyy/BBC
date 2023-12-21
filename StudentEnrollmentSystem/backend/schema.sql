-- Filename: setup_student_enrollment_db.sql

-- Use student_enrollment_db
CREATE DATABASE IF NOT EXISTS student_enrollment_db;
USE student_enrollment_db;

-- Modify Admin table to include password column
CREATE TABLE IF NOT EXISTS Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL  -- New column for password
);
-- Create Student table
CREATE TABLE IF NOT EXISTS Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL
);

-- Create Teacher table
CREATE TABLE IF NOT EXISTS Teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create Course table
CREATE TABLE IF NOT EXISTS Course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create Class table
CREATE TABLE IF NOT EXISTS Class (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    schedule_time TIME NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id)
);

-- Create Enrollment table
CREATE TABLE IF NOT EXISTS Enrollment (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    grade VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (class_id) REFERENCES Class(class_id)
);

-- Stored Procedures for CRUD operations

-- Drop and Create Admin Procedures with password
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateAdmin$$
CREATE PROCEDURE CreateAdmin(IN _name VARCHAR(255), IN _email VARCHAR(255), IN _password VARCHAR(255))
BEGIN
    INSERT INTO Admin (name, email, password) VALUES (_name, _email, _password);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadAdmin$$
CREATE PROCEDURE ReadAdmin(IN _admin_id INT)
BEGIN
    SELECT * FROM Admin WHERE admin_id = _admin_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS UpdateAdmin$$
CREATE PROCEDURE UpdateAdmin(IN _admin_id INT, IN _name VARCHAR(255), IN _email VARCHAR(255), IN _password VARCHAR(255))
BEGIN
    UPDATE Admin SET name = _name, email = _email, password = _password WHERE admin_id = _admin_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteAdmin$$
CREATE PROCEDURE DeleteAdmin(IN _admin_id INT)
BEGIN
    DELETE FROM Admin WHERE admin_id = _admin_id;
END$$
DELIMITER ;


-- Drop and Create Student Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateStudent$$
CREATE PROCEDURE CreateStudent(IN _name VARCHAR(255), IN _email VARCHAR(255), IN _date_of_birth DATE)
BEGIN
    INSERT INTO Student (name, email, date_of_birth) VALUES (_name, _email, _date_of_birth);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadStudent$$
CREATE PROCEDURE ReadStudent(IN _student_id INT)
BEGIN
    SELECT * FROM Student WHERE student_id = _student_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS UpdateStudent$$
CREATE PROCEDURE UpdateStudent(IN _student_id INT, IN _name VARCHAR(255), IN _email VARCHAR(255), IN _date_of_birth DATE)
BEGIN
    UPDATE Student SET name = _name, email = _email, date_of_birth = _date_of_birth WHERE student_id = _student_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteStudent$$
CREATE PROCEDURE DeleteStudent(IN _student_id INT)
BEGIN
    DELETE FROM Student WHERE student_id = _student_id;
END$$
DELIMITER ;

-- Drop and Create Teacher Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateTeacher$$
CREATE PROCEDURE CreateTeacher(IN _name VARCHAR(255), IN _email VARCHAR(255))
BEGIN
    INSERT INTO Teacher (name, email) VALUES (_name, _email);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadTeacher$$
CREATE PROCEDURE ReadTeacher(IN _teacher_id INT)
BEGIN
    SELECT * FROM Teacher WHERE teacher_id = _teacher_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS UpdateTeacher$$
CREATE PROCEDURE UpdateTeacher(IN _teacher_id INT, IN _name VARCHAR(255), IN _email VARCHAR(255))
BEGIN
    UPDATE Teacher SET name = _name, email = _email WHERE teacher_id = _teacher_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteTeacher$$
CREATE PROCEDURE DeleteTeacher(IN _teacher_id INT)
BEGIN
    DELETE FROM Teacher WHERE teacher_id = _teacher_id;
END$$
DELIMITER ;

-- Drop and Create Course Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateCourse$$
CREATE PROCEDURE CreateCourse(IN _title VARCHAR(255), IN _description TEXT)
BEGIN
    INSERT INTO Course (title, description) VALUES (_title, _description);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadCourse$$
CREATE PROCEDURE ReadCourse(IN _course_id INT)
BEGIN
    SELECT * FROM Course WHERE course_id = _course_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS UpdateCourse$$
CREATE PROCEDURE UpdateCourse(IN _course_id INT, IN _title VARCHAR(255), IN _description TEXT)
BEGIN
    UPDATE Course SET title = _title, description = _description WHERE course_id = _course_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteCourse$$
CREATE PROCEDURE DeleteCourse(IN _course_id INT)
BEGIN
    DELETE FROM Course WHERE course_id = _course_id;
END$$
DELIMITER ;

-- Drop and Create Class Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateClass$$
CREATE PROCEDURE CreateClass(IN _course_id INT, IN _teacher_id INT, IN _schedule_time TIME)
BEGIN
    INSERT INTO Class (course_id, teacher_id, schedule_time) VALUES (_course_id, _teacher_id, _schedule_time);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadClass$$
CREATE PROCEDURE ReadClass(IN _class_id INT)
BEGIN
    SELECT * FROM Class WHERE class_id = _class_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS UpdateClass$$
CREATE PROCEDURE UpdateClass(IN _class_id INT, IN _course_id INT, IN _teacher_id INT, IN _schedule_time TIME)
BEGIN
    UPDATE Class SET course_id = _course_id, teacher_id = _teacher_id, schedule_time = _schedule_time WHERE class_id = _class_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteClass$$
CREATE PROCEDURE DeleteClass(IN _class_id INT)
BEGIN
    DELETE FROM Class WHERE class_id = _class_id;
END$$
DELIMITER ;

-- Drop and Create Enrollment Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateEnrollment$$
CREATE PROCEDURE CreateEnrollment(IN _student_id INT, IN _class_id INT, IN _grade VARCHAR(2))
BEGIN
    INSERT INTO Enrollment (student_id, class_id, grade) VALUES (_student_id, _class_id, _grade);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadEnrollment$$
CREATE PROCEDURE ReadEnrollment(IN _enrollment_id INT)
BEGIN
    SELECT * FROM Enrollment WHERE enrollment_id = _enrollment_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS UpdateEnrollment$$
CREATE PROCEDURE UpdateEnrollment(IN _enrollment_id INT, IN _student_id INT, IN _class_id INT, IN _grade VARCHAR(2))
BEGIN
    UPDATE Enrollment SET student_id = _student_id, class_id = _class_id, grade = _grade WHERE enrollment_id = _enrollment_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteEnrollment$$
CREATE PROCEDURE DeleteEnrollment(IN _enrollment_id INT)
BEGIN
    DELETE FROM Enrollment WHERE enrollment_id = _enrollment_id;
END$$
DELIMITER ;

-- Views and Procedures for Views

-- Drop and Create Views
DROP VIEW IF EXISTS CourseDetailView;
CREATE VIEW CourseDetailView AS
SELECT c.course_id, c.title, t.name AS teacher_name, cl.schedule_time
FROM Course c
JOIN Class cl ON c.course_id = cl.course_id
JOIN Teacher t ON cl.teacher_id = t.teacher_id;

DROP VIEW IF EXISTS StudentEnrollmentView;
CREATE VIEW StudentEnrollmentView AS
SELECT s.student_id, s.name AS student_name, c.title AS course_title, e.grade
FROM Student s
JOIN Enrollment e ON s.student_id = e.student_id
JOIN Class cl ON e.class_id = cl.class_id
JOIN Course c ON cl.course_id = c.course_id;

-- Drop and Create Procedures for Views
DELIMITER $$
DROP PROCEDURE IF EXISTS ReadCourseDetail$$
CREATE PROCEDURE ReadCourseDetail()
BEGIN
    SELECT * FROM CourseDetailView;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadStudentEnrollment$$
CREATE PROCEDURE ReadStudentEnrollment()
BEGIN
    SELECT * FROM StudentEnrollmentView;
END$$
DELIMITER ;

-- Triggers for Cascade Effects

-- Drop and Create Triggers
DELIMITER $$
DROP TRIGGER IF EXISTS AfterCourseDelete$$
CREATE TRIGGER AfterCourseDelete
AFTER DELETE ON Course
FOR EACH ROW
BEGIN
    DELETE FROM Class WHERE course_id = OLD.course_id;
END$$
DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS AfterClassDelete$$
CREATE TRIGGER AfterClassDelete
AFTER DELETE ON Class
FOR EACH ROW
BEGIN
    DELETE FROM Enrollment WHERE class_id = OLD.class_id;
END$$
DELIMITER ;
