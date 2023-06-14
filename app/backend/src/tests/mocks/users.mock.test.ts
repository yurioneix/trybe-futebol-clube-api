const userRegistered = {
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      // senha: secret_admin
}

const userWithoutPassword = {
    username: 'Admin',
}

const userWithoutEmail = {
    password: 'secret_admin'
}

const wrongPassUser = {
    username: 'Admin',
    password: 'framengo'
}

const validLoginBody = {
    username: 'Admin',
    password: 'secret_admin'
}

export {
    userRegistered,
    userWithoutPassword,
    wrongPassUser,
    validLoginBody,
    userWithoutEmail
}