const userRegistered = {
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      // senha: secret_admin
}

const userWithoutPassword = {
    email: 'admin@admin.com',
}

const userWithoutEmail = {
    password: 'secret_admin'
}

const wrongPassUser = {
    email: 'admin@admin.com',
    password: 'framengo'
}

const validAndRegisteredUser = {
    email: 'admin@admin.com',
    password: 'secret_admin'
}

const unauthorizedEmail = {
    email: 'germancano@email.com',
    password: 'secret_admin'
}

const unauthorizedPassword = {
    email: 'admin@admin.com',
    password: 'flucampeaoliberta2023'
}

export {
    userRegistered,
    userWithoutPassword,
    wrongPassUser,
    validAndRegisteredUser,
    userWithoutEmail,
    unauthorizedEmail,
    unauthorizedPassword
}