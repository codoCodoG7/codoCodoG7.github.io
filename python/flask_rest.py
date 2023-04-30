from flask import jsonify, request
import loguru

# Configuración del logger
loguru.logger.add("/home/crisguille/mysite/debug.log", level="DEBUG")

#menu db mockup
menusData = [
    {"id": 1, "price":1250.00, "name": "Americana", "description": "La hamburguesa americana....", "image": "/images/menu/american_sq.jpg", "menuType": 1},
    {"id": 2, "price":1200.00, "name": "Clásica", "description": "La hamburguesa clásica....", "image": "/images/menu/classic_sq.jpg", "menuType": 1},
    {"id": 3, "price":1150.00, "name": "BBQ", "description": "La hamburguesa BBQ....", "image": "/images/menu/krisp_sq.jpg", "menuType": 1},
    {"id": 4, "price":1100.00, "name": "Mexicana", "description": "La hamburguesa mexicana....", "image": "/images/menu/classic_sq.jpg", "menuType": 2},
    {"id": 5, "price":1050.00, "name": "Hawaiana", "description": "La hamburguesa hawaiana....", "image": "/images/menu/american_sq.jpg", "menuType": 2},
    {"id": 6, "price":1000.00, "name": "Vegetariana", "description": "La hamburguesa clásica....", "image": "/images/menu/american_sq.jpg", "menuType": 2},
    {"id": 7, "price":550.00,  "name": "Papas fritas", "description": "Las papas fritas....", "image": "/images/menu/extra_sq_01.jpg", "menuType": 3},
    {"id": 8, "price":650.00,  "name": "Cheddar", "description": "Un extra de cheddar....", "image": "/images/menu/extra_sq_02.jpg", "menuType": 3},
    {"id": 9, "price":550.00,  "name": "Aderezo", "description": "Más aderezos....", "image": "/images/menu/extra_sq_03.jpg", "menuType": 3},
]

def v1():
     # Imprimir los encabezados de la solicitud HTTP
    loguru.logger.debug(f"Encabezados: {request.headers}")
    # Imprimir el json de la solicitud HTTP
    loguru.logger.debug(f"Argumentos: {request.json}")
    # Imprimir los argumentos de la solicitud HTTP
    loguru.logger.debug(f"Argumentos: {request.args}")

    # Imprimir los datos del formulario de una solicitud POST
    loguru.logger.debug(f"Datos de formulario: {request.form}")

    # Imprimir los archivos cargados en una solicitud POST
    loguru.logger.debug(f"Archivos cargados: {request.files}")

    # Imprimir las cookies enviadas con la solicitud HTTP
    loguru.logger.debug(f"Cookies: {request.cookies}")

    # Imprimir la dirección IP del cliente
    loguru.logger.debug(f"Dirección IP: {request.remote_addr}")

    # Imprimir la URL completa de la solicitud HTTP
    loguru.logger.debug(f"URL: {request.url}")

    # Imprimir la ruta de la solicitud HTTP
    loguru.logger.debug(f"Ruta: {request.path}")

    # Imprimir el método HTTP utilizado para la solicitud
    loguru.logger.debug(f"Método: {request.method}")
    if request.method == 'GET':
        return jsonify({'version': '1.0'})
    elif request.method == 'POST':
        data = request.get_json()
        # procesa los datos recibidos
        return jsonify({'status': 'ok'})
    elif request.method == 'PUT':
        data = request.get_json()
        # actualiza los datos en la base de datos
        return jsonify({'status': 'ok'})
    elif request.method == 'PATCH':
        data = request.get_json()
        # actualiza parcialmente los datos en la base de datos
        return jsonify({'status': 'ok'})
    else:
        return jsonify({'error': 'invalid request method'}), 405


def comment():
    # GET / POST  for /api/v1/comment/
    return jsonify({'message': 'comment endpoint for comment'})
def comments(commentId):
    # GET / POST / PUT / PATCH / DELETE for /api/v1/comments/<commentId>
    return jsonify({'message': f'comment endpoint for comment ID {commentId}'})

def menu():
    # GET / POST  for /api/v1/menu
    return jsonify({'message': 'menus endpoint'})
def menus(menuId):
    # GET / POST  / PUT / PATCH / DELETE for /api/v1/menus/<menuId>
    return jsonify({'message': 'menus endpoint for ID {menuId}'})

def menuType():
    # GET / POST
    return jsonify({'message': 'menuType endpoint for /api/v1/menuType'})
def menuTypes(typeId):
    # GET / POST / PUT / PATCH / DELETE for /api/v1/menu/menuTypes/<typeId>
    return jsonify({'message': 'menuType endpoint for ID {typeId}'})

def menuTypeItems(typeId):
    # GET for  /api/v1/menuTypeItems/<typeId>
    #manu id 1 premium, 2 clasic, 3 extras
    loguru.logger.debug(f"Recibo:{typeId}")
    loguru.logger.debug(menus)
    if request.method == 'GET':
        filtered_items = [item for item in menusData if item['menuType'] == typeId]
        if filtered_items:
            return jsonify(filtered_items)
        else:
            return jsonify({"error": "Menu not found"}), 404
    else:
        return jsonify({'error': 'menu type not found'}), 405
    #return jsonify({'message': f'menu endpoint for menu ID {menuId}'})


