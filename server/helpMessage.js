module.exports = {
  available_routes: [
    'POST => /api/login',
    'POST => /api/register',
    'DELETE => /api/user/:id',
    'GET => /api/user/:id',
    'GET => /api/user/:id/favorites',
    'POST => /api/user/:id/favorites',
    'DELETE => /api/user/:id/favorites'
  ]
}
