from flask import Flask
from crud import articles_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"], "methods": ["POST", "GET", "DELETE", "PUT"]}})

app.register_blueprint(articles_bp, url_prefix='/api')



if __name__ == '__main__':
    app.run(debug=True) 



#import logging
#from logging.handlers import RotatingFileHandler

# Configurar el registro de errores
#app.logger.setLevel(logging.INFO)
#file_handler = RotatingFileHandler('app.log', maxBytes=10240, backupCount=10)
#file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
#app.logger.addHandler(file_handler)