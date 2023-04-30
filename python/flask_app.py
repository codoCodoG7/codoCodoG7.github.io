#Flask app
from flask import Flask
from flask_cors import CORS
from flask_rest import v1, comment, comments, menu, menus, menuType, menuTypes, menuTypeItems

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.add_url_rule('/api/v1', 'v1', v1, methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
app.add_url_rule('/api/v1/comments', 'get_comments', comment, methods=['GET', 'POST'])
app.add_url_rule('/api/v1/comments/<int:commentId>', 'comments', comments, methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])

app.add_url_rule('/api/v1/menus', 'get_menus', menu, methods=['GET', 'POST'])
app.add_url_rule('/api/v1/menus/<int:menuId>', 'menus', menus, methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])

app.add_url_rule('/api/v1/menuTypes', 'get_menuTypes', menuType, methods=['GET', 'POST'])
app.add_url_rule('/api/v1/menuTypes/<int:typeId>', 'menuTypes', menuTypes, methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])

app.add_url_rule('/api/v1/menuTypeItems/<int:typeId>', 'menuTypeItems', menuTypeItems, methods=['GET'])

@app.route('/')
def hello_world():
    return 'Hello from Flask! '+__name__+'*** '