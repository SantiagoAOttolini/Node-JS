const { Categoria, Usuario } = require("../models")

const obtenerCategorias = async(req, res) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        //El populate hace que se muestre el usuario que lo creo
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({ 
        total,
        categorias
    });
}

const obtenerCategoria = async(req, res) => {
    const { id } = req.params
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json(categoria);
}


const crearCategoria = async(req, res) => {
    const nombre = req.body.nombre.toUpperCase()

    // Existe una categoria con ese nombre?
    const categoriaDB = await Categoria.findOne({ nombre })

    //Si existe mando el error
    if (categoriaDB) {
        res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data que se va a aguardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    await categoria.save()
    
    res.status(201).json(categoria)
}

const actualizarCategoria = async(req, res) => {
    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

    res.json(categoria)
}

const borrarCategoria = async(req, res) => {
    const { id } = req.params

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json(categoria)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
