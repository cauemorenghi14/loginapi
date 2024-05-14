import Route from '@ioc:Adonis/Core/Route'

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  try {
    const token = await auth.use('api').attempt(email, password, { expiresIn: '30 mins' })
    return token
  } catch {
    return response.unauthorized('Usuário ou senha inválidos')
  }
})

Route.get('dashboard', async ({ auth }) => {
  try {
    await auth.use('api').authenticate()
    const usuario = auth.user?.username
    return `Bem vindo ${usuario}! você está autenticado!`
  } catch (error) {
    return `Erro: Você não está mais autenticado.`
  }
})

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('api').revoke()
  return {
    revoked: true
  }
})

Route.resource('/users', 'UsersController').apiOnly()
