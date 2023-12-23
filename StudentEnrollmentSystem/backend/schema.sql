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

-- Create Teacher table
CREATE TABLE IF NOT EXISTS Teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create Class table
CREATE TABLE IF NOT EXISTS Class (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL
);

-- Create Course table with schedule attribute
CREATE TABLE IF NOT EXISTS Course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id INT,
    teacher_id INT,
    schedule_time VARCHAR(255) NOT NULL,  -- New column for schedule
    FOREIGN KEY (class_id) REFERENCES Class(class_id),
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id)
);

-- Create Student table
CREATE TABLE IF NOT EXISTS Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id INT,
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

DELIMITER $$
DROP PROCEDURE IF EXISTS GetNumberOfAdmins$$
CREATE PROCEDURE GetNumberOfAdmins()
BEGIN
    SELECT COUNT(*) FROM Admin;
END$$
DELIMITER ;



-- Drop and Create Student Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateStudent$$
CREATE PROCEDURE CreateStudent(IN _name VARCHAR(255), IN _email VARCHAR(255), IN _date_of_birth DATE, IN _class_id INT)
BEGIN
    INSERT INTO Student (name, email, date_of_birth, class_id) VALUES (_name, _email, _date_of_birth, _class_id);
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
CREATE PROCEDURE UpdateStudent(IN _student_id INT, IN _name VARCHAR(255), IN _email VARCHAR(255), IN _date_of_birth DATE, IN _class_id INT)
BEGIN
    UPDATE Student SET name = _name, email = _email, date_of_birth = _date_of_birth, class_id = _class_id WHERE student_id = _student_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteStudent$$
CREATE PROCEDURE DeleteStudent(IN _student_id INT)
BEGIN
    DELETE FROM Student WHERE student_id = _student_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetNumberOfStudents$$
CREATE PROCEDURE GetNumberOfStudents()
BEGIN
    SELECT COUNT(*) FROM Student;
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

DELIMITER $$
DROP PROCEDURE IF EXISTS GetNumberOfTeachers$$
CREATE PROCEDURE GetNumberOfTeachers()
BEGIN
    SELECT COUNT(*) FROM Teacher;
END$$
DELIMITER ;


-- Drop and Create Course Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateCourse$$
CREATE PROCEDURE CreateCourse(IN _title VARCHAR(255), IN _description TEXT, IN _class_id INT, IN _teacher_id INT, IN _schedule_time VARCHAR(255))
BEGIN
    INSERT INTO Course (title, description, class_id, teacher_id, schedule_time) VALUES (_title, _description, _class_id, _teacher_id, _schedule_time);
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
CREATE PROCEDURE UpdateCourse(
    IN _course_id INT,
    IN _title VARCHAR(255),
    IN _description TEXT,
    IN _class_id INT,
    IN _schedule_time VARCHAR(255),
    IN _teacher_id INT
)
BEGIN
    UPDATE Course
    SET title = _title,
        description = _description,
        class_id = _class_id,
        schedule_time = _schedule_time,
        teacher_id = _teacher_id
    WHERE course_id = _course_id;
END$$
DELIMITER ;



DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteCourse$$
CREATE PROCEDURE DeleteCourse(IN _course_id INT)
BEGIN
    DELETE FROM Course WHERE course_id = _course_id;
END$$
DELIMITER ;

-- Drop and Create Course Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS GetNumberOfCoursesPerClass$$
CREATE PROCEDURE GetNumberOfCoursesPerClass(IN _class_id INT)
BEGIN
    SELECT COUNT(*) FROM Course WHERE class_id = _class_id;
END$$
DELIMITER ;



-- Drop and Create Class Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS CreateClass$$
CREATE PROCEDURE CreateClass(IN _class_name VARCHAR(255))
BEGIN
    INSERT INTO Class (class_name) VALUES (_class_name);
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
CREATE PROCEDURE UpdateClass(IN _class_id INT, IN _class_name VARCHAR(255))
BEGIN
    UPDATE Class SET class_name = _class_name WHERE class_id = _class_id;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteClass$$
CREATE PROCEDURE DeleteClass(IN _class_id INT)
BEGIN
    DELETE FROM Class WHERE class_id = _class_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetNumberOfClasses$$
CREATE PROCEDURE GetNumberOfClasses()
BEGIN
    SELECT COUNT(*) FROM Class;
END$$
DELIMITER ;



-- Views and Procedures for Views

-- Drop and Create Views
DROP VIEW IF EXISTS CourseDetailView;
CREATE VIEW CourseDetailView AS
SELECT c.course_id, c.title, c.description, c.schedule_time, t.name AS teacher_name, cl.class_name
FROM Course c
JOIN Class cl ON c.class_id = cl.class_id
JOIN Teacher t ON c.teacher_id = t.teacher_id;


-- More Procedures

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadClassDetail$$
CREATE PROCEDURE ReadClassDetail(IN _class_id INT)
BEGIN
    SELECT cl.class_id, co.title, co.description, t.name as teacher_name, t.email as teacher_email
    FROM Class cl
    JOIN Course co ON cl.course_id = co.course_id
    JOIN Teacher t ON co.teacher_id = t.teacher_id
    WHERE cl.class_id = _class_id;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS ReadStudentDetail$$
CREATE PROCEDURE ReadStudentDetail(IN _student_id INT)
BEGIN
    SELECT * FROM Student WHERE student_id = _student_id;
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

-- Drop and Create GetAll Procedures
DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllAdmins$$
CREATE PROCEDURE GetAllAdmins()
BEGIN
    SELECT * FROM Admin;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllStudents$$
CREATE PROCEDURE GetAllStudents()
BEGIN
    SELECT * FROM Student;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllTeachers$$
CREATE PROCEDURE GetAllTeachers()
BEGIN
    SELECT * FROM Teacher;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllCourses$$
CREATE PROCEDURE GetAllCourses()
BEGIN
    SELECT * FROM Course;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllClasses$$
CREATE PROCEDURE GetAllClasses()
BEGIN
    SELECT * FROM Class;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllCourseDetails$$
CREATE PROCEDURE GetAllCourseDetails()
BEGIN
    SELECT * FROM CourseDetailView;
END$$
DELIMITER ;
