const { response, json } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: `Hable con el administrador, ${error}`
        });
    }

}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, correo, img } = await googleVerify(id_token);
        // const googleUser = await googleVerify(id_token);
        // console.log(googleUser);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //     Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROL',
                google: true
            };
            console.log('************************ ',data)
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Todo bien!',
            usuario,
            token,
            // googleUser
        })

    } catch (error) {
            console.log(error)
            res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'

        })

    }

}

module.exports = {
    login,
    googleSignIn
}
