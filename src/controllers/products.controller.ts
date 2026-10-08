import { pool } from '../conf/dbConnection';

export const getAllProducts = async (req: any, res: any) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT id, name, price, stock, description, brand, img, active FROM products WHERE active = ? ORDER BY id',
            [true]
        );
        res.status(200).json(rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error interno en el servidor' });
    }
};

export const getProductById = async (req: any, res: any) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'El id debe ser un número entero positivo' });
    }

    try {
        const [rows]: any = await pool.query(
            'SELECT id, name, price, stock, description, brand, img, active FROM products WHERE id = ? AND active = ?',
            [id, true]
        );

        res.status(200).json(rows[0] || {});
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error interno en el servidor' });
    }
};

export const createProduct = async (req: any, res: any) => {
    const { name, price, stock, description, brand, img } = req.body;

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
    }

    try {
        const [result]: any = await pool.query(
            'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, stock, description, brand, img]
        );
        res.status(201).json({ message: 'Producto creado exitosamente', id: result.insertId });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar en la base de datos' });
    }
};

export const updateProduct = async (req: any, res: any) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'El id debe ser un número entero positivo' });
    }

    const { name, price, stock, description, brand, img } = req.body;

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
    }

    try {
        await pool.query(
            'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = ?',
            [name, price, stock, description, brand, img, id, true]
        );

        res.status(200).json({ message: 'Petición de actualización procesada' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = async (req: any, res: any) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'El id debe ser un número entero positivo' });
    }

    try {
        await pool.query(
            'UPDATE products SET active = ? WHERE id = ? AND active = ?',
            [false, id, true]
        );

        res.status(200).json({ message: 'Producto dado de baja lógicamente' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error al dar de baja el producto' });
    }
};

export const changePrice = async (req: any, res: any) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'El id debe ser un número entero positivo' });
    }

    const { price } = req.body;

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
    }

    try {
        await pool.query(
            'UPDATE products SET price = ? WHERE id = ? AND active = ?',
            [price, id, true]
        );

        res.status(200).json({ message: 'Precio actualizado' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar el precio' });
    }
};