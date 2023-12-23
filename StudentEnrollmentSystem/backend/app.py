from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
import mysql.connector

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
    def __init__(self, name, email, date_of_birth, class_id):
        super().__init__(name, email)
        self.date_of_birth = date_of_birth
        self.class_id = class_id

    def create(self, proc_name, args):
        data = request.json
        execute_procedure(proc_name, args)
        return jsonify(data), 201

    def read(self, proc_name, id):
        results = execute_procedure(proc_name, [id])
        # Add labels to the results
        labels = ["id", "name", "email", "date_of_birth", "class_id"]
        results = [dict(zip(labels, result)) for result in results]
        return jsonify(results), 200

    def update(self, proc_name, id, args):
        data = request.json
        execute_procedure(proc_name, [id] + args)
        return jsonify(data), 200

    def delete(self, proc_name, id):
        execute_procedure(proc_name, [id])
        return '', 204


# Teacher class inherits from Person
class Teacher(Person):
    def __init__(self, name, email):
        super().__init__(name, email)

# Course class
class Course:
    def __init__(self, title, description, class_id, teacher_id, schedule_time):
        self.title = title
        self.description = description
        self.class_id = class_id
        self.teacher_id = teacher_id
        self.schedule_time = schedule_time

    def create(self, proc_name, args):
        data = request.json
        execute_procedure(proc_name, args)
        return jsonify(data), 201

    def read(self, proc_name, id):
        results = execute_procedure(proc_name, [id])
        # Add labels to the results
        labels = ["id", "title", "description", "class_id", "teacher_id", "schedule_time"]
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
    def __init__(self, class_name):
        self.class_name = class_name

    def create(self, proc_name, args):
        data = request.json
        execute_procedure(proc_name, args)
        return jsonify(data), 201

    def read(self, proc_name, id):
        results = execute_procedure(proc_name, [id])
        # Add labels to the results
        labels = ["id", "class_name"]
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

@app.route('/admin/count', methods=['GET'])
def get_number_of_admins():
    results = execute_procedure('GetNumberOfAdmins', [])
    return jsonify({'count': results[0][0]}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    # Retrieve admin by email using the stored procedure
    results = execute_procedure('GetAdminByEmail', [email])

    if results:
        # Check if the provided password matches the stored password
        stored_password = results[0][3]  # Assuming the password is the third column in the Admin table
        if stored_password == password:
            # Construct response in the same format as the second example
            admin_data = {
                "email": email,  # Adjust based on your Admin model attributes
                "password": stored_password,  # Assuming you want to return the stored password
                "id": results[0][0],  # Assuming the ID is in the first column
                "name": results[0][1]  # Assuming the name is in the second column
            }
            return jsonify(admin_data), 200
        else:
            return jsonify({'message': 'Incorrect password'}), 401
    else:
        return jsonify({'message': 'Admin not found'}), 404


# Student Routes
@app.route('/student', methods=['POST'])
def create_student():
    student = Student(request.json['name'], request.json['email'], request.json['date_of_birth'], request.json['class_id'])
    return student.create('CreateStudent', [student.name, student.email, student.date_of_birth, student.class_id])


@app.route('/student/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def student_operations(id):
    if request.method == 'GET':
        student = Student(None, None, None, None)
        return student.read('ReadStudent', id)
    elif request.method == 'PUT':
        student = Student(request.json['name'], request.json['email'], None, None)
        return student.update('UpdateStudent', id, [student.name, student.email])
    elif request.method == 'DELETE':
        student = Student(None, None, None, None)
        return student.delete('DeleteStudent', id)


@app.route('/student/count', methods=['GET'])
def get_number_of_students():
    results = execute_procedure('GetNumberOfStudents', [])
    return jsonify({'count': results[0][0]}), 200

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

@app.route('/teacher/count', methods=['GET'])
def get_number_of_teachers():
    results = execute_procedure('GetNumberOfTeachers', [])
    return jsonify({'count': results[0][0]}), 200

# Course Routes
@app.route('/course', methods=['POST'])
def create_course():
    course = Course(request.json['title'], request.json['description'], request.json['class_id'], request.json['teacher_id'], request.json['schedule_time'])
    return course.create('CreateCourse', [course.title, course.description, course.class_id, course.teacher_id, course.schedule_time])

@app.route('/course/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def course_operations(id):
    if request.method == 'GET':
        course = Course(None, None, None, None, None)
        return course.read('ReadCourse', id)
    elif request.method == 'PUT':
        course = Course(request.json['title'], request.json['description'], request.json['class_id'], request.json['teacher_id'], request.json['schedule_time'])
        return course.update('UpdateCourse', id, [course.title, course.description, course.class_id, course.teacher_id, course.schedule_time])
    elif request.method == 'DELETE':
        course = Course(None, None, None, None, None)
        return course.delete('DeleteCourse', id)

@app.route('/course/count', methods=['GET'])
def get_number_of_courses():
    results = execute_procedure('GetNumberOfCourses', [])
    return jsonify({'count': results[0][0]}), 200


@app.route('/class/<int:class_id>/course/count', methods=['GET'])
def get_number_of_courses_per_class(class_id):
    results = execute_procedure('GetNumberOfCoursesPerClass', [class_id])
    return jsonify({'count': results[0][0]}), 200

# Class Routes
@app.route('/class', methods=['POST'])
def create_class():
    class_ = Class(request.json['class_name'])
    return class_.create('CreateClass', [class_.class_name])

@app.route('/class/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def class_operations(id):
    if request.method == 'GET':
        class_ = Class(None)
        return class_.read('ReadClass', id)
    elif request.method == 'PUT':
        class_ = Class(request.json['class_name'])
        return class_.update('UpdateClass', id, [class_.class_name])
    elif request.method == 'DELETE':
        class_ = Class(None)
        return class_.delete('DeleteClass', id)


@app.route('/class/count', methods=['GET'])
def get_number_of_classes():
    results = execute_procedure('GetNumberOfClasses', [])
    return jsonify({'count': results[0][0]}), 200

# View Routes

@app.route('/class/<int:class_id>/detail', methods=['GET'])
def class_detail_view(class_id):
    results = execute_procedure('ReadClassDetail', [class_id])
    labels = ["class_id", "course_title", "course_description", "teacher_name", "teacher_email"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/student/<int:student_id>/detail', methods=['GET'])
def student_detail_view(student_id):
    results = execute_procedure('ReadStudentDetail', [student_id])
    labels = ["student_id", "name", "email", "date_of_birth"]
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
    labels = ["id", "name", "email", "date_of_birth", "class_id"]
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
    labels = ["id", "title", "description", "class_id", "teacher_id", "schedule_time"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

@app.route('/class/all', methods=['GET'])
def get_all_classes():
    results = execute_procedure('GetAllClasses', [])
    # Add labels to the results
    labels = ["id", "class_name"]
    results = [dict(zip(labels, result)) for result in results]
    return jsonify(results), 200

# View Routes
@app.route('/course-detail-view/all', methods=['GET'])
def get_all_course_details():
    results = execute_procedure('GetAllCourseDetails', [])
    
    # Updated labels to match the new column names
    labels = ["course_id", "title", "description", "teacher_id", "teacher_name", "teacher_email", "class_id", "schedule_time"]
    
    # Mapping results to a list of dictionaries
    results = [dict(zip(labels, result)) for result in results]
    
    return jsonify(results), 200


# Main execution
if __name__ == '__main__':
     app.run(debug=True)
