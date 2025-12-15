exports.handler = async (event, context) => {
  console.log('Proxy function called:', {
    path: event.path,
    method: event.httpMethod,
    query: event.rawQuery
  })
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    }
  }
  
  let path = event.path
  if (path.startsWith('/.netlify/functions/proxy')) {
    path = path.replace('/.netlify/functions/proxy', '')
  }
  const apiUrl = `http://v2991160.hosted-by-vdsina.ru${path}${event.rawQuery ? '?' + event.rawQuery : ''}`
  
  console.log('Proxying to:', apiUrl)
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (event.headers.authorization) {
    headers['Authorization'] = event.headers.authorization
  }
  
  if (event.headers.cookie) {
    headers['Cookie'] = event.headers.cookie
  }
  
  try {
    const response = await fetch(apiUrl, {
      method: event.httpMethod,
      headers: headers,
      body: event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' ? event.body : undefined,
    })
    
    const data = await response.text()
    
    const responseHeaders = {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': event.headers.origin || '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
    }
    
    const setCookieHeader = response.headers.get('Set-Cookie')
    if (setCookieHeader) {
      responseHeaders['Set-Cookie'] = setCookieHeader
    }
    
    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: data,
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: error.message }),
    }
  }
}

