from flask import Blueprint, request, jsonify
from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from conexion import get_db_connection

articles_bp = Blueprint('articles', __name__)

Base = declarative_base()

class Article(Base):
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    details = Column(String)
    total = Column(Integer)
    cost = Column(Numeric)
    created_at = Column(TIMESTAMP, default=datetime.now)
    updated_at = Column(TIMESTAMP, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f"Article(id={self.id}, title='{self.title}')"

@articles_bp.route('/articles', methods=['GET'])
def get_articles():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Parámetros de búsqueda y paginación
        name = request.args.get('name', '')

        # Construir la consulta SQL
        sql = "SELECT * FROM articles"
        if name:
            sql += f" WHERE title LIKE '%{name}%'"
        sql += " ORDER BY id DESC"

        cursor.execute(sql)
        articles = cursor.fetchall()

        # Obtener el recuento total de artículos
        total_sql = "SELECT COUNT(*) FROM articles"
        if name:
            total_sql += f" WHERE title LIKE '%{name}%'"
        cursor.execute(total_sql)
        total_articles = cursor.fetchone()[0]

        # Preparar la respuesta
        response = {
            'articleCount': total_articles,
            'article': [
                {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'price': row[3],
                    'stock': row[4]
                } for row in articles
            ]
        }

        return jsonify(response)
    except Exception as e:
        print(f"Error al obtener los artículos: {str(e)}")
        return jsonify({"error": "Error al obtener los artículos"}), 500
    finally:
        cursor.close()
        conn.close()



@articles_bp.route('/articles', methods=['POST'])
def create_article():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        data = request.get_json()

       # print("Datos recibidos en la API:", data)

        name = data.get('name', None)
        description = data.get('description', None)
        price = data.get('price', None)
        stock = data.get('stock', None)
        updated_at = datetime.now()
        created_at = datetime.now()

        # if not name is None:
        #    return jsonify({'message': 'Error: name is a required field'}), 400

        sql = "INSERT INTO articles (title, details, total, cost, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (name, description, stock, price, created_at, updated_at)
        cursor.execute(sql, values)
        conn.commit()

        if cursor.rowcount > 0:
            return jsonify({'message': 'Article created successfully'}), 200
        else:
            return jsonify({'message': 'Error: Couldn\'t create the article'}), 500
    except Exception as e:
        print(f"Error creating article: {str(e)}")
        return jsonify({'message': 'An error occurred while creating the article'}), 500
    finally:
        cursor.close()
        conn.close()



@articles_bp.route('/renew', methods=['PUT'])
def update_article():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        data = request.get_json()

      #  print("Receive:", data)

        id = data.get('id')
        name = data.get('name')
        description = data.get('description', None)
        price = data.get('price', None)
        stock = data.get('stock', None)
        updated_at = datetime.now()

        if not id or not name:
            return jsonify({'message': 'Error: Name, price and stock are required fields'}), 400

        sql = "UPDATE articles SET title=%s, details=%s, total=%s, cost=%s, updated_at=%s WHERE id=%s"
        values = (name, description, stock, price, updated_at, id)
        cursor.execute(sql, values)
        conn.commit()

        if cursor.rowcount > 0:
            return jsonify({'message': 'Article updated successfully'}), 200
        else:
            return jsonify({'message': 'Error: Couldn\'t update the article'}), 500
    except Exception as e:
        print(f"Error updating article: {e}")
        return jsonify({'message': 'An error occurred while updating the article'}), 500
    finally:
        cursor.close()
        conn.close()



@articles_bp.route('/delete', methods=['DELETE'])
def delete_article():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        data = request.get_json()

        # print("Receive:", data) 
             
        id = data['id']

        if not id:
            return jsonify({'message': 'Error: id is a required field'}), 400

        sql = "DELETE FROM articles WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        conn.commit()

        if cursor.rowcount > 0:
            return jsonify({'message': 'Article deleted successfully'}), 200
        else:
            return jsonify({'message': 'Error: Couldn\'t delete the article'}), 500
    except Exception as e:
        print(f"Error deleting article: {str(e)}")
        return jsonify({'message': 'An error occurred while deleting the article'}), 500
    finally:
        cursor.close()
        conn.close()

        

if __name__ == '__main__':
    articles_bp.run(debug=True)