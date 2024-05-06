const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) throw new Error(` El rol ${rol} no está registrado en la BD`)
}

const esCorreoValido = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) throw new Error(`El correo ${correo}, ya está registrado`)

}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) throw new Error(`El id no existe ${id}`)

}

const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) throw new Error(`El id no existe ${id}`)

}

const existeProductosPorId = async (id) => {
    const existeProductos = await Producto.findById(id)
    if (!existeProductos) throw new Error(`El id no existe ${id}`)

}
/**
 * Validar coleciones permitidas
 */
const coleccionesPermitidas = async (coleccion = '', colecciones = [] )=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }
    return true;


} 




module.exports = {
    esRoleValido,
    esCorreoValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductosPorId,
    coleccionesPermitidas
}