const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./restaurant.db');

app.use(cors());
app.use(express.json()); // Reemplaza a bodyParser.json()
app.use(express.static('public')); 




// CRUD Endpoints

// CREATE: Añadir un nuevo elemento al menú
app.post('/api/menu', (req, res) => {
    console.log("Request body:", req.body);  // Añadir log para depurar
    const { nombre, precio, descripcion, tipo } = req.body;
    const query = 'INSERT INTO menu_items (nombre, precio, descripcion, tipo) VALUES (?, ?, ?, ?)';
    
    db.run(query, [nombre, precio, descripcion, tipo], function(err) {
      if (err) {
        console.log("Error:", err);  // Añadir log para depurar
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
});

  
  
  app.get('/api/menu', (req, res) => {
    const query = 'SELECT * FROM menu_items';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  });
  
  
  app.put('/api/menu/:id', (req, res) => {
    console.log("Solicitud PUT recibida para ID:", req.params.id);  // Nuevo log
    console.log("Datos recibidos en el cuerpo de la solicitud:", req.body);  // Nuevo log
  
    const { id } = req.params;
    const { nombre, precio, descripcion, tipo } = req.body;
    const query = 'UPDATE menu_items SET nombre = ?, precio = ?, descripcion = ?, tipo = ? WHERE id = ?';
    
    db.run(query, [nombre, precio, descripcion, tipo, id], function(err) {
      if (err) {
        console.log("Error al ejecutar la consulta:", err.message);  // Nuevo log
        res.status(500).json({ error: err.message });
        return;
      }
      console.log("Número de cambios realizados:", this.changes);  // Nuevo log
      res.json({ changes: this.changes });
    });
  });
  
  app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM menu_items WHERE id = ?';
    
    db.run(query, id, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ deleted: this.changes });
    });
  });
  
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });