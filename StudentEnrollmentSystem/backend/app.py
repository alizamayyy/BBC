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

# Helper function to convert tuples to dictionaries
def tuple_to_dict(tuple_list, keys):
    dict_list = []
    for t in tuple_list:
        d = dict(zip(keys, t))
        dict_list.append(d)
    return dict_list

# Admin Routes
@app.route('/admin', methods=['POST'])
def create_admin():
    data = request.json
    execute_procedure('CreateAdmin', [data['name'], data['email'], data['password']])
    return jsonify(data), 201

@app.route('/admin/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def admin_operations(id):
    if request.method == 'GET':
        results = execute_procedure('ReadAdmin', [id])
        keys = ['admin_id', 'name', 'email', 'password']
        results = tuple_to_dict(results, keys)
        return jsonify(results), 200
    elif request.method == 'PUT':
        data = request.json
        execute_procedure('UpdateAdmin', [id, data['name'], data['email'], data['password']])
        return jsonify(data), 200
    elif request.method == 'DELETE':
        execute_procedure('DeleteAdmin', [id])
        return '', 204

# Student Routes
@app.route('/student', methods=['POST'])
def create_student():
    data = request.json
    execute_procedure('CreateStudent', [data['name'], data['email'], data['date_of_birth']])
    return jsonify(data), 201

@app.route('/student/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def student_operations(id):
    if request.method == 'GET':
        results = execute_procedure('ReadStudent', [id])
        keys = ['student_id', 'name', 'email', 'date_of_birth']
        results = tuple_to_dict(results, keys)
        return jsonify(results), 200
    elif request.method == 'PUT':
        data = request.json
        execute_procedure('UpdateStudent', [id, data['name'], data['email'], data['date_of_birth']])
        return jsonify(data), 200
    elif request.method == 'DELETE':
        execute_procedure('DeleteStudent', [id])
        return '', 204

# Teacher Routes
@app.route('/teacher', methods=['POST'])
def create_teacher():
    data = request.json
    execute_procedure('CreateTeacher', [data['name'], data['email']])
    return jsonify(data), 201

@app.route('/teacher/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def teacher_operations(id):
    if request.method == 'GET':
        results = execute_procedure('ReadTeacher', [id])
        keys = ['teacher_id', 'name', 'email']
        results = tuple_to_dict(results, keys)
        return jsonify(results), 200
    elif request.method == 'PUT':
        data = request.json
        execute_procedure('UpdateTeacher', [id, data['name'], data['email']])
        return jsonify(data), 200
    elif request.method == 'DELETE':
        execute_procedure('DeleteTeacher', [id])
        return '', 204

# Course Routes
@app.route('/course', methods=['POST'])
def create_course():
    data = request.json
    execute_procedure('CreateCourse', [data['title'], data['description']])
    return jsonify(data), 201

@app.route('/course/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def course_operations(id):
    if request.method == 'GET':
        results = execute_procedure('ReadCourse', [id])
        keys = ['course_id', 'title', 'description']
        results = tuple_to_dict(results, keys)
        return jsonify(results), 200
    elif request.method == 'PUT':
        data = request.json
        execute_procedure('UpdateCourse', [id, data['title'], data['description']])
        return jsonify(data), 200
    elif request.method == 'DELETE':
        execute_procedure('DeleteCourse', [id])
        return '', 204

# Class Routes
@app.route('/class', methods=['POST'])
def create_class():
    data = request.json
    execute_procedure('CreateClass', [data['course_id'], data['teacher_id'], data['schedule_time']])
    return jsonify(data), 201

@app.route('/class/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def class_operations(id):
    if request.method == 'GET':
        results = execute_procedure('ReadClass', [id])
        keys = ['class_id', 'course_id', 'teacher_id', 'schedule_time']
        results = tuple_to_dict(results, keys)
        return jsonify(results), 200
    elif request.method == 'PUT':
        data = request.json
        execute_procedure('UpdateClass', [id, data['course_id'], data['teacher_id'], data['schedule_time']])
        return jsonify(data), 200
    elif request.method == 'DELETE':
        execute_procedure('DeleteClass', [id])
        return '', 204

# Enrollment Routes
@app.route('/enrollment', methods=['POST'])
def create_enrollment():
    data = request.json
    execute_procedure('CreateEnrollment', [data['student_id'], data['class_id'], data['grade']])
    return jsonify(data), 201

@app.route('/enrollment/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def enrollment_operations(id):
    if request.method == 'GET':
        results = execute_procedure('ReadEnrollment', [id])
        keys = ['enrollment_id', 'student_id', 'class_id', 'grade']
        results = tuple_to_dict(results, keys)
        return jsonify(results), 200
    elif request.method == 'PUT':
        data = request.json
        execute_procedure('UpdateEnrollment', [id, data['student_id'], data['class_id'], data['grade']])
        return jsonify(data), 200
    elif request.method == 'DELETE':
        execute_procedure('DeleteEnrollment', [id])
        return '', 204

# View Routes
@app.route('/course-detail-view', methods=['GET'])
def course_detail_view():
    results = execute_procedure('ReadCourseDetail', [])
    keys = ['course_id', 'title', 'teacher_name', 'schedule_time']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/student-enrollment-view', methods=['GET'])
def student_enrollment_view():
    results = execute_procedure('ReadStudentEnrollment', [])
    keys = ['student_id', 'student_name', 'course_title', 'grade']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

# Routes for GetAll Procedures
@app.route('/admin/all', methods=['GET'])
def get_all_admins():
    results = execute_procedure('GetAllAdmins', [])
    keys = ['admin_id', 'name', 'email', 'password']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/student/all', methods=['GET'])
def get_all_students():
    results = execute_procedure('GetAllStudents', [])
    keys = ['student_id', 'name', 'email', 'date_of_birth']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/teacher/all', methods=['GET'])
def get_all_teachers():
    results = execute_procedure('GetAllTeachers', [])
    keys = ['teacher_id', 'name', 'email']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/course/all', methods=['GET'])
def get_all_courses():
    results = execute_procedure('GetAllCourses', [])
    keys = ['course_id', 'title', 'description']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/class/all', methods=['GET'])
def get_all_classes():
    results = execute_procedure('GetAllClasses', [])
    keys = ['class_id', 'course_id', 'teacher_id', 'schedule_time']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/enrollment/all', methods=['GET'])
def get_all_enrollments():
    results = execute_procedure('GetAllEnrollments', [])
    keys = ['enrollment_id', 'student_id', 'class_id', 'grade']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

# View Routes
@app.route('/course-detail-view/all', methods=['GET'])
def get_all_course_details():
    results = execute_procedure('GetAllCourseDetails', [])
    keys = ['course_id', 'title', 'teacher_name', 'schedule_time']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

@app.route('/student-enrollment-view/all', methods=['GET'])
def get_all_student_enrollments():
    results = execute_procedure('GetAllStudentEnrollments', [])
    keys = ['student_id', 'student_name', 'course_title', 'grade']
    results = tuple_to_dict(results, keys)
    return jsonify(results), 200

# Main execution
if __name__ == '__main__':
    app.run(debug=True)