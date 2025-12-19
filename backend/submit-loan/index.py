import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обрабатывает заявки на кредит от игроков
    Args: event - запрос с данными заявки
          context - контекст выполнения функции
    Returns: результат сохранения заявки
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    minecraft_nickname = body_data.get('minecraftNickname', '').strip()
    telegram_username = body_data.get('telegramUsername', '').strip()
    diamond_amount = int(body_data.get('diamondAmount', 0))
    loan_period = int(body_data.get('loanPeriod', 0))
    total_return = int(body_data.get('totalReturn', 0))
    interest = int(body_data.get('interest', 0))
    
    if not minecraft_nickname or not telegram_username or diamond_amount <= 0:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Заполните все поля'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute('''
        INSERT INTO loan_applications 
        (minecraft_nickname, telegram_username, diamond_amount, loan_period_days, total_return_amount, interest_amount)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (minecraft_nickname, telegram_username, diamond_amount, loan_period, total_return, interest))
    
    application_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'success': True,
            'applicationId': application_id,
            'message': 'Ваша заявка оформлена! Ждите ответа, вам напишут в Telegram'
        }),
        'isBase64Encoded': False
    }
