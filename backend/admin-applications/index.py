import json
import os
import psycopg2
from typing import Dict, Any

ADMIN_PASSWORD = "blackrock2024"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает список всех заявок для администратора
    Args: event - запрос с паролем администратора
          context - контекст выполнения функции
    Returns: список заявок или ошибка доступа
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    admin_password = headers.get('x-admin-password') or headers.get('X-Admin-Password')
    
    if admin_password != ADMIN_PASSWORD:
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Неверный пароль администратора'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute('''
        SELECT id, minecraft_nickname, telegram_username, diamond_amount, 
               loan_period_days, total_return_amount, interest_amount, 
               status, created_at
        FROM loan_applications
        ORDER BY created_at DESC
    ''')
    
    applications = []
    for row in cur.fetchall():
        applications.append({
            'id': row[0],
            'minecraftNickname': row[1],
            'telegramUsername': row[2],
            'diamondAmount': row[3],
            'loanPeriodDays': row[4],
            'totalReturnAmount': row[5],
            'interestAmount': row[6],
            'status': row[7],
            'createdAt': row[8].isoformat() if row[8] else None
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'applications': applications}),
        'isBase64Encoded': False
    }
