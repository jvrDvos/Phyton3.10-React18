import mysql.connector

# Datos de conexión a la base de datos
servername = "localhost"
username = "root"
password = ""
database = "store"

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=servername,
            user=username,
            password=password,
            database=database
        )
        return conn
    except mysql.connector.Error as e:
        raise Exception(f"Error de conexión: {e}")