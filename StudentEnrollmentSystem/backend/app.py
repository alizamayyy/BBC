from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database Configuration
db_config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'database': 'student_enrollment_db',
    'raise_on_warnings': True
}

# Database Connection
def db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
    except mysql.connector.Error as e:
        print("Database connection failed:", e)
        return None
    return conn

# Helper function to execute stored procedures
def execute_procedure(proc_name, args):
    conn = db_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor()
        cursor.callproc(proc_name, args)
        results = []
        for result in cursor.stored_results():
            results.extend(result.fetchall())
        conn.commit()
    except mysql.connector.Error as e:
        print("Error executing procedure:", e)
        results = []
    finally:
        cursor.close()
        conn.close()

    return results

# Base class for Admin, Student, and Teacher
class Person:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def create(self, proc_name, args):
        data = request.json
        execute_procedure(proc_name, args)
        return jsonify(data), 201

    def read(self, proc_name, id):
        results = execute_procedure(proc_name, [id])
        # Add labels to the results
        labels = ["id", "name", "email"]
        results = [dict(zip(labels, result)) for result in results]
        return jsonify(results), 200

    def update(self, proc_name, id, args):
        data = request.json
        execute_procedure(proc_name, [id] + args)
        return jsonify(data), 200

    def delete(self, proc_name, id):
        execute_procedure(proc_name, [id])
        return '', 204

# Admin class inherits from Person
class Admin(Person):
    def __init__(self, name, email, password):
        super().__init__(name, email)
        self.password = password

# Student class inherits from Person
class Student(Person):
    def __init__(self, name, email, date_of_birth):
        super().__init__(name, email)
        self.date_of_birth = date_of_birth

# Teacher class inherits from Person
class Teacher(Person):
    def __init__(self, name, email):
        super().__init__(name, email)

# Course class
class Course:
    def __init__(self, title, description):
        self.title = title
        self.description = description

    def create(self, proc_name, args):
        data = request.json
        execute_procedure(proc_name, args)
        return jsonify(data), 201

    def read(self, proc_name, id):
        results = execute_procedure(proc_name, [id])
        # Add labels to the results
        labels = ["id", "title", "description"]
        results = [dict(zip(labels, result)) for result in results]
        return jsonify(results), 200

    def update(self, proc_name, id, args):
        data = request.json
        execute_procedure(proc_name, [id] + args)
        return jsonify(data), 200

    def delete(self, proc_name, id):
        execute_procedure(proc_name, [id])
        return '', 204

# Class class
class Class:
    def __init__(self, course_id, teacher_id, schedule_time):
        self.course_id = course_id
        self.teacher_id = teacher_id
        self.schedule_time = schedule_time

    def create(self, proc_name, args):
        data = request.json
        execute_procedure(proc_name, args)
        return jsonify(data), 201

    def read(self, proc_name, id):
        results = execute_procedure(proc_name, [id])
        # Add labels to the results
        labels = ["id", "course_id", "teacher_id", "schedule_time"]
        results = [dict(zip(labels, result)) for result in results]
        return jsonify(results), 200

    def update(self, proc_name, id, args):
        data = request.json
        execute_procedure(proc_name, [id] + args)
        return jsonify(data), 200

    def delete(self, proc_name, id):
        execute_procedure(proc_name, [id])
        return '', 204

# Admin Routes
@app.route('/admin', methods=['POST'])
def create_admin():
    admin = Admin(request.json['name'], request.json['email'], request.json['password'])
    return admin.create('CreateAdmin', [admin.name, admin.email, admin.password])

@app.route('/admin/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def admin_operations(id):
    if request.method == 'GET':
        admin = Admin(None, None, None)
        return admin.read('ReadAdmin', id)
    elif request.method == 'PUT':
        admin = Admin(request.json['name'], request.json['email'], request.json['password'])
        return admin.update('UpdateAdmin', id, [admin.name, admin.email, admin.password])
    elif request.method == 'DELETE':
        admin = Admin(None, None, None)
        return admin.delete('DeleteAdmin', id)

# Student Routes
@app.route('/student', methods=['POST'])
def create_student():
    student = Student(request.json['name'], request.json['email'], request.json['date_of_birth'])
    return student.create('CreateStudent', [student.name, student.email, student.date_of_birth])

@app.route('/student/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def student_operations(id):
    if request.method == 'GET':
        student = Student(None, None, None)
        return student.read('ReadStudent', id)
    elif request.method == 'PUT':
        student = Student(request.json['name'], request.json['email'], request.json['date_of_birth'])
        return student.update('UpdateStudent', id, [student.name, student.email, student.date_of_birth])
    elif request.method == 'DELETE':
        student = Student(None, None, None)
        return student.delete('DeleteStudent', id)

# Teacher Routes
@app.route('/teacher', methods=['POST'])
def create_teacher():
    teacher = Teacher(request.json['name'], request.json['email'])
    return teacher.create('CreateTeacher', [teacher.name, teacher.email])

@app.route('/teacher/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def teacher_operations(id):
    if request.method == 'GET':
        teacher = Teacher(None, None)
        return teacher.read('ReadTeacher', id)
    elif request.method == 'PUT':
        teacher = Teacher(request.json['name'], request.json['email'])
        return teacher.update('UpdateTeacher', id, [teacher.name, teacher.email])
    elif request.method == 'DELETE':
        teacher = Teacher(None, None)
        return teacher.delete('DeleteTeacher', id)

# Course Routes
@app.route('/course', methods=['POST'])
def create_course():
    course = Course(request.json['title'], request.json['description'])
    return course.create('CreateCourse', [course.title, course.description])

@app.route('/course/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def course_operations(id):
    if request.method == 'GET':
        course = Course(None, None)
        return course.read('ReadCourse', id)
    elif request.method == 'PUT':
        course = Course(request.json['title'], request.json['description'])
        return course.update('UpdateCourse', id, [course.title, course.description])
    elif request.method == 'DELETE':
        course = Course(None, None)
        return course.delete('DeleteCourse', id)

# Class Routes
@app.route('/class', methods=['POST'])
def create_class():
    class_ = Class(request.json['course_id'], request.json['teacher_id'], request.json['schedule_time'])
    return class_.create('CreateClass', [class_.course_id, class_.teacher_id, class_.schedule_time])

@app.route('/class/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def class_operations(id):
    if request.method == 'GET':
        class_ = Class(None, None, None)
        return class_.read('ReadClass', id)
    elif request.method == 'PUT':
        class_ = Class(request.json['course_id'], request.json['teacher_id'], request.json['schedule_time'])
        return class_.update('UpdateClass', id, [class_.course_id, class_.teacher_id, class_.schedule_time])
    elif request.method == 'DELETE':
        class_ = Class(None, None, None)
        return class_.delete('DeleteClass', id)

# View Routes
@app.route('/course-detail-view', methods=['GET'])
def course_detail_view():
    results = execute_procedure('ReadCourseDetail', [])
    # Add labels to the results
    labels = ["course_id", "course_title", "course_description", "teacher_id", "teacher_name", "teacher_email", "class_id", "schedule_time"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

# Routes for GetAll Procedures
@app.route('/admin/all', methods=['GET'])
def get_all_admins():
    results = execute_procedure('GetAllAdmins', [])
    # Add labels to the results
    labels = ["id", "name", "email", "password"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/student/all', methods=['GET'])
def get_all_students():
    results = execute_procedure('GetAllStudents', [])
    # Add labels to the results
    labels = ["id", "name", "email", "date_of_birth"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/teacher/all', methods=['GET'])
def get_all_teachers():
    results = execute_procedure('GetAllTeachers', [])
    # Add labels to the results
    labels = ["id", "name", "email"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/course/all', methods=['GET'])
def get_all_courses():
    results = execute_procedure('GetAllCourses', [])
    # Add labels to the results
    labels = ["id", "title", "description"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/class/all', methods=['GET'])
def get_all_classes():
    results = execute_procedure('GetAllClasses', [])
    # Add labels to the results
    labels = ["id", "course_id", "teacher_id", "schedule_time"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/course-detail-view/all', methods=['GET'])
def get_all_course_details():
    results = execute_procedure('GetAllCourseDetails', [])
    # Add labels to the results
    labels = ["course_id", "course_title", "course_description", "teacher_id", "teacher_name", "teacher_email", "class_id", "schedule_time"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

# Main execution
if __name__ == '__main__':
    app.run(debug=True)
